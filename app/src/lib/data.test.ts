import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, ensureInstalledAt, getMeta, lastSetsFor } from '../db'
import { importBackup, wipeAll } from './backup'
import { clock, kg, repsLabel, weekStart } from './format'
import { describePlates, perSide } from './plates'
import { suggestRaise, volume } from './progression'
import { ALL_EXERCISES, ROUTINE, dayOfExercise, exerciseById } from '../data/routine'

beforeEach(async () => {
  await wipeAll()
  await db.meta.clear()
})

const addSession = async (dayId: string, sets: [string, number, number, number][]) => {
  const id = await db.sessions.add({ dayId, startedAt: Date.now(), finishedAt: Date.now() })
  for (const [ex, no, w, r] of sets) await db.sets.add({ sessionId: id, exerciseId: ex, setNo: no, weightKg: w, reps: r, doneAt: Date.now() })
  return id
}

describe('historial', () => {
  it('lastSetsFor devuelve la sesión anterior ordenada por serie', async () => {
    await addSession('dia-1', [['hip-thrust', 1, 60, 10], ['hip-thrust', 2, 60, 9]])
    const b = await addSession('dia-1', [['hip-thrust', 2, 65, 8], ['hip-thrust', 1, 65, 10]])
    const last = await lastSetsFor('hip-thrust')
    expect(last.map((s) => s.setNo)).toEqual([1, 2])
    expect(last[0].weightKg).toBe(65)
    const before = await lastSetsFor('hip-thrust', b)
    expect(before[0].weightKg).toBe(60)
  })
  it('sin historial devuelve lista vacía', async () => expect(await lastSetsFor('curl-martillo')).toEqual([]))
  it('installedAt se guarda una sola vez', async () => {
    const a = await ensureInstalledAt()
    expect(await ensureInstalledAt()).toBe(a)
    expect(await getMeta('installedAt')).toBe(a)
  })
})

describe('respaldo', () => {
  const file = (o: unknown) => new File([JSON.stringify(o)], 'b.json', { type: 'application/json' })
  it('restaura sesiones y series', async () => {
    const n = await importBackup(file({ app: 'cima', version: 1, exportedAt: 1, sessions: [{ id: 1, dayId: 'dia-1', startedAt: 1 }], sets: [{ id: 1, sessionId: 1, exerciseId: 'hip-thrust', setNo: 1, weightKg: 50, reps: 10, doneAt: 1 }] }))
    expect(n).toBe(1)
    expect(await db.sets.count()).toBe(1)
    expect(typeof (await getMeta('lastBackupAt'))).toBe('number')
  })
  it('rechaza archivos que no son de Cima y no borra nada', async () => {
    await addSession('dia-2', [['press-militar', 1, 10, 10]])
    await expect(importBackup(file({ foo: 1 }))).rejects.toThrow('no es un respaldo de Cima')
    expect(await db.sets.count()).toBe(1)
  })
  it('rechaza JSON inválido', async () => {
    await expect(importBackup(new File(['no json'], 'x.json'))).rejects.toThrow()
  })
  it('wipeAll borra todo', async () => {
    await addSession('dia-1', [['hip-thrust', 1, 60, 10]])
    await wipeAll()
    expect(await db.sessions.count()).toBe(0)
    expect(await db.sets.count()).toBe(0)
  })
})

describe('formato', () => {
  it('clock', () => {
    expect(clock(180)).toBe('3:00')
    expect(clock(59.2)).toBe('1:00')
    expect(clock(-5)).toBe('0:00')
  })
  it('kg usa coma decimal', () => expect(kg(62.5)).toBe('62,5'))
  it('repsLabel', () => {
    expect(repsLabel(8, 10)).toBe('8–10')
    expect(repsLabel(12, 12)).toBe('12')
  })
  it('weekStart cae en lunes a las 00:00', () => {
    const w = new Date(weekStart(new Date(2026, 10, 26, 15).getTime())) // jueves
    expect(w.getDay()).toBe(1)
    expect(w.getHours()).toBe(0)
    expect(new Date(weekStart(new Date(2026, 10, 29, 9).getTime())).getDay()).toBe(1) // domingo
  })
})

describe('discos y progresión, casos límite', () => {
  it('pesos por debajo de la barra no llevan discos', () => expect(perSide(10)).toEqual([]))
  it('suma de discos reconstruye el peso', () => {
    for (let w = 20; w <= 200; w += 2.5) expect(20 + 2 * perSide(w).reduce((a, p) => a + p, 0)).toBe(w)
  })
  it('describePlates', () => {
    expect(describePlates(20)).toBe('sin discos')
    expect(describePlates(100)).toBe('25 + 15')
  })
  it('no sugiere subir con peso 0', () => expect(suggestRaise({ sets: 1, repsMax: 10, step: 1 }, [{ weightKg: 0, reps: 10 }])).toBeNull())
  it('sube al menos un paso con pesos pequeños', () => expect(suggestRaise({ sets: 1, repsMax: 12, step: 1 }, [{ weightKg: 6, reps: 12 }])).toBe(7))
  it('volume', () => expect(volume([{ weightKg: 50, reps: 10 }, { weightKg: 60, reps: 8 }])).toBe(980))
})

describe('rutina, integridad', () => {
  it('ids únicos y youtubeId en todos', () => {
    const ids = ALL_EXERCISES.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of ALL_EXERCISES) expect(e.youtubeId, e.id).toMatch(/^[\w-]{11}$/)
  })
  it('rangos de repeticiones, series y descanso válidos', () => {
    for (const e of ALL_EXERCISES) {
      expect(e.repsMin, e.id).toBeLessThanOrEqual(e.repsMax)
      expect(e.sets).toBeGreaterThan(0)
      expect(e.restSec).toBeGreaterThanOrEqual(90)
      expect(e.restSec).toBeLessThanOrEqual(180)
      expect(e.step).toBeGreaterThan(0)
    }
  })
  it('solo los ejercicios de barra muestran discos y son tres', () => {
    expect(ALL_EXERCISES.filter((e) => e.implement === 'barra').map((e) => e.id).sort()).toEqual(['buenos-dias-smith', 'hip-thrust', 'peso-muerto-rumano'])
  })
  it('búsquedas', () => {
    expect(exerciseById('hip-thrust')?.name).toBe('Hip thrust')
    expect(dayOfExercise('curl-martillo')?.n).toBe(4)
    expect(ROUTINE.map((d) => d.exercises.length)).toEqual([6, 6, 5, 6, 6])
  })
})
