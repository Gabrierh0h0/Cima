import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import { CATALOG, EXTRA, norm } from '../data/catalog'
import { ROUTINE } from '../data/routine'
import { exportBackup, importBackup, wipeAll } from './backup'
import {
  BASE_ID,
  activeRoutine,
  allRoutines,
  dayById,
  decodeRoutine,
  encodeRoutine,
  exerciseById,
  exerciseIdFor,
  initRoutines,
  newRoutineId,
  saveRoutine,
  setActiveRoutine,
  toExercise,
  toStored,
} from './routines'

beforeEach(async () => {
  await wipeAll()
  await db.routines.clear()
  await db.meta.clear()
  await initRoutines()
})

const mine = () => {
  const id = newRoutineId()
  return {
    id,
    name: 'Mi rutina',
    createdAt: Date.now(),
    days: [
      { id: `${id}-a`, name: 'Pecho', exercises: [toStored(CATALOG.find((e) => e.id === 'press-pecho-maquina')!), { id: 'x-mi-ejercicio', name: 'Mi ejercicio', sets: 4, repsMin: 6, repsMax: 8, restSec: 120, implement: 'polea' }] },
      { id: `${id}-b`, name: 'Espalda', exercises: [toStored(CATALOG.find((e) => e.id === 'jalon-pecho')!)] },
    ],
  }
}

describe('catálogo', () => {
  it('ids y nombres únicos, y los extras no chocan con la rutina base', () => {
    const ids = CATALOG.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(CATALOG.map((e) => norm(e.name))).size).toBe(CATALOG.length)
    expect(CATALOG).toHaveLength(28 + EXTRA.length)
  })
  it('cada ejercicio extra tiene 3 pistas, implemento y búsqueda', () => {
    for (const e of EXTRA) {
      expect(e.cues, e.id).toHaveLength(3)
      expect(e.search.length).toBeGreaterThan(5)
    }
  })
  it('un nombre escrito con otra forma cae en el mismo ejercicio', () => {
    expect(exerciseIdFor('  PRESS  inclinado ')).toBe('press-inclinado')
    expect(exerciseIdFor('Dominadas lastradas')).toBe('x-dominadas-lastradas')
  })
})

describe('rutinas del usuario', () => {
  it('sin rutinas guardadas solo existe la base y está en uso', () => {
    expect(allRoutines().map((r) => r.id)).toEqual([BASE_ID])
    expect(activeRoutine().days).toBe(ROUTINE)
  })
  it('guarda, usa y resuelve ejercicios del catálogo y propios', async () => {
    const r = mine()
    await saveRoutine(r, true)
    expect(activeRoutine().id).toBe(r.id)
    const d = dayById(r.days[0].id)!
    expect(d.n).toBe(1)
    expect(d.exercises[0].cues).toHaveLength(3)
    const custom = d.exercises[1]
    expect(custom).toMatchObject({ name: 'Mi ejercicio', sets: 4, implement: 'polea', step: 2.5 })
    expect(custom.cues).toHaveLength(3)
    expect(exerciseById('x-mi-ejercicio')?.name).toBe('Mi ejercicio')
  })
  it('cambiar de rutina y volver a la base conserva todo', async () => {
    const r = mine()
    await saveRoutine(r, true)
    await setActiveRoutine(BASE_ID)
    expect(activeRoutine().id).toBe(BASE_ID)
    expect(allRoutines()).toHaveLength(2)
  })
  it('sets de otra rutina siguen resolviendo su ejercicio', async () => {
    await saveRoutine(mine(), true)
    await setActiveRoutine(BASE_ID)
    expect(exerciseById('x-mi-ejercicio')).toBeTruthy()
    expect(exerciseById('hip-thrust')?.name).toBe('Hip thrust')
  })
  it('toExercise usa los valores de la persona sobre los del catálogo', () => {
    const e = toExercise({ id: 'hip-thrust', name: 'x', sets: 5, repsMin: 5, repsMax: 5, restSec: 60 })
    expect(e).toMatchObject({ name: 'Hip thrust', sets: 5, repsMin: 5, restSec: 60, implement: 'barra' })
  })
})

describe('compartir por enlace', () => {
  it('ida y vuelta conserva días, ejercicios y números', () => {
    const r = mine()
    const back = decodeRoutine(encodeRoutine(r))!
    expect(back.name).toBe('Mi rutina')
    expect(back.id).not.toBe(r.id)
    expect(back.days.map((d) => d.name)).toEqual(['Pecho', 'Espalda'])
    expect(back.days[0].exercises.map((e) => e.id)).toEqual(['press-pecho-maquina', 'x-mi-ejercicio'])
    expect(back.days[0].exercises[1]).toMatchObject({ sets: 4, repsMin: 6, repsMax: 8, restSec: 120, implement: 'polea' })
  })
  it('el enlace es seguro para ir en una URL y soporta tildes y eñes', () => {
    const r = mine()
    r.name = 'Rutina de Año Nuevo ñandú'
    const code = encodeRoutine(r)
    expect(code).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(decodeRoutine(code)!.name).toBe('Rutina de Año Nuevo ñandú')
  })
  it('rechaza enlaces rotos o vacíos', () => {
    expect(decodeRoutine('###')).toBeNull()
    expect(decodeRoutine('')).toBeNull()
    const bad = btoa(JSON.stringify({ v: 2, n: 'x', d: [] }))
    expect(decodeRoutine(bad)).toBeNull()
  })
  it('limpia valores absurdos y no confía en ids ajenos', () => {
    const evil = { v: 1, n: '<img src=x onerror=alert(1)>'.repeat(10), d: [{ n: 'D', e: [['hip-thrust', 'ignorado', 999, 50, 3, 99999, 'nuclear', 1], ['id-raro/../x', 'Otro', -4, 'a', 'b', 'c']] }] }
    const out = decodeRoutine(btoa(JSON.stringify(evil)))!
    expect(out.name.length).toBeLessThanOrEqual(40)
    const [a, b] = out.days[0].exercises
    expect(a).toMatchObject({ id: 'hip-thrust', name: 'Hip thrust', sets: 10, repsMin: 50, repsMax: 50, restSec: 600, implement: undefined })
    expect(b.id).toBe('x-otro')
    expect(b.sets).toBe(1)
    expect(b.repsMax).toBeGreaterThanOrEqual(b.repsMin)
  })
})

describe('respaldo con rutinas', () => {
  it('exporta e importa las rutinas junto al progreso', async () => {
    const r = mine()
    await saveRoutine(r, true)
    const sid = await db.sessions.add({ dayId: r.days[0].id, startedAt: 1, finishedAt: 2 })
    await db.sets.add({ sessionId: sid, exerciseId: 'x-mi-ejercicio', setNo: 1, weightKg: 30, reps: 8, doneAt: 2 })
    let saved = ''
    const origCreate = URL.createObjectURL
    // exportBackup arma un Blob; lo leemos en vez de descargarlo
    let blob: Blob | undefined
    URL.createObjectURL = ((b: Blob) => ((blob = b), 'blob:x')) as typeof URL.createObjectURL
    ;(globalThis as { document?: unknown }).document = { createElement: () => ({ click() {} }) }
    await exportBackup()
    URL.createObjectURL = origCreate
    saved = await blob!.text()
    expect(JSON.parse(saved).routines).toHaveLength(1)

    await db.routines.clear()
    await wipeAll()
    await initRoutines()
    expect(allRoutines()).toHaveLength(1)
    await importBackup(new File([saved], 'b.json'))
    expect(allRoutines().map((x) => x.id)).toContain(r.id)
    expect(activeRoutine().id).toBe(r.id)
    expect(await db.sets.count()).toBe(1)
  })
  it('un respaldo viejo sin rutinas no borra las que ya existen', async () => {
    await saveRoutine(mine())
    const old = { app: 'cima', version: 1, exportedAt: 1, sessions: [], sets: [] }
    await importBackup(new File([JSON.stringify(old)], 'o.json'))
    expect(await db.routines.count()).toBe(1)
  })
})
