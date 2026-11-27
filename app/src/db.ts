import Dexie, { type Table } from 'dexie'

export interface Session {
  id?: number
  dayId: string
  startedAt: number
  finishedAt?: number
}

export interface SetLog {
  id?: number
  sessionId: number
  exerciseId: string
  setNo: number
  weightKg: number
  reps: number
  doneAt: number
}

export interface Meta {
  key: string
  value: number | string
}

class CimaDB extends Dexie {
  sessions!: Table<Session, number>
  sets!: Table<SetLog, number>
  meta!: Table<Meta, string>
  constructor() {
    super('cima')
    this.version(1).stores({
      sessions: '++id,dayId,startedAt',
      sets: '++id,sessionId,exerciseId,doneAt',
      meta: 'key',
    })
  }
}

export const db = new CimaDB()

export async function getMeta<T extends number | string>(key: string): Promise<T | undefined> {
  return (await db.meta.get(key))?.value as T | undefined
}
export const setMeta = (key: string, value: number | string) => db.meta.put({ key, value })

export async function ensureInstalledAt(): Promise<number> {
  const v = await getMeta<number>('installedAt')
  if (v) return v
  const now = Date.now()
  await setMeta('installedAt', now)
  return now
}

/** Series de la última sesión terminada o en curso anterior que incluyó el ejercicio. */
export async function lastSetsFor(exerciseId: string, excludeSessionId?: number) {
  const all = await db.sets.where('exerciseId').equals(exerciseId).toArray()
  const other = all.filter((s) => s.sessionId !== excludeSessionId)
  if (!other.length) return []
  const lastSession = Math.max(...other.map((s) => s.sessionId))
  return other.filter((s) => s.sessionId === lastSession).sort((a, b) => a.setNo - b.setNo)
}
