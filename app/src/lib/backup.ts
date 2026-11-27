import { db, getMeta, setMeta, type Session, type SetLog, type StoredRoutine } from '../db'
import { initRoutines } from './routines'

interface Backup {
  app: 'cima'
  version: 1
  exportedAt: number
  sessions: Session[]
  sets: SetLog[]
  /** Rutinas creadas o recibidas (los respaldos antiguos no las traen). */
  routines?: StoredRoutine[]
  activeRoutine?: string
}

export async function exportBackup(): Promise<boolean> {
  const data: Backup = {
    app: 'cima',
    version: 1,
    exportedAt: Date.now(),
    sessions: await db.sessions.toArray(),
    sets: await db.sets.toArray(),
    routines: await db.routines.toArray(),
    activeRoutine: await getMeta<string>('activeRoutine'),
  }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const name = `cima-respaldo-${new Date().toISOString().slice(0, 10)}.json`
  const file = new File([blob], name, { type: 'application/json' })
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: 'Respaldo de Cima' })
      await setMeta('lastBackupAt', Date.now())
      return true
    } catch {
      return false // cancelado
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  await setMeta('lastBackupAt', Date.now())
  return true
}

export async function importBackup(file: File): Promise<number> {
  const data = JSON.parse(await file.text()) as Backup
  if (data.app !== 'cima' || !Array.isArray(data.sessions) || !Array.isArray(data.sets)) {
    throw new Error('Este archivo no es un respaldo de Cima.')
  }
  await db.transaction('rw', db.sessions, db.sets, db.routines, async () => {
    await db.sessions.clear()
    await db.sets.clear()
    await db.sessions.bulkAdd(data.sessions)
    await db.sets.bulkAdd(data.sets)
    if (Array.isArray(data.routines)) {
      await db.routines.clear()
      await db.routines.bulkAdd(data.routines)
    }
  })
  if (typeof data.activeRoutine === 'string') await setMeta('activeRoutine', data.activeRoutine)
  await initRoutines()
  await setMeta('lastBackupAt', Date.now())
  return data.sessions.length
}

export async function wipeAll(): Promise<void> {
  await db.sessions.clear()
  await db.sets.clear()
}
