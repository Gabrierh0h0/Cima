// Rutinas: la base de Cima más las que arma o recibe cada persona. Todo vive en el dispositivo.
import { db, getMeta, setMeta, type StoredDay, type StoredEx, type StoredRoutine } from '../db'
import { ROUTINE, type Day, type Exercise, type Implement } from '../data/routine'
import { CATALOG, IMPLEMENTS, catalogById, norm } from '../data/catalog'

export interface Routine {
  id: string
  name: string
  days: Day[]
  builtin?: boolean
}

export const BASE_ID = 'base'
const BASE: Routine = { id: BASE_ID, name: 'Rutina Cima', days: ROUTINE, builtin: true }

const STEP: Record<Implement, number> = { barra: 2.5, mancuernas: 1, maquina: 2.5, polea: 2.5, cuerpo: 2.5, libre: 2.5 }
const GENERIC_CUES = ['Controla el movimiento, sin rebotes.', 'Respira: exhala en el esfuerzo.', 'Si pierdes la técnica, baja el peso.']
const IMPLEMENT_IDS = IMPLEMENTS.map(([i]) => i) as Implement[]
const isImplement = (v: unknown): v is Implement => IMPLEMENT_IDS.includes(v as Implement)

/** Id estable de un ejercicio a partir de su nombre: así el progreso sigue aunque lo escribas otra vez. */
export function exerciseIdFor(name: string): string {
  const n = norm(name)
  const hit = CATALOG.find((e) => norm(e.name) === n)
  return hit ? hit.id : `x-${n.replace(/ /g, '-').slice(0, 48)}`
}

/** Convierte lo guardado en un Exercise completo, usando el catálogo si existe. */
export function toExercise(s: StoredEx): Exercise {
  const base = catalogById(s.id)
  if (base) return { ...base, sets: s.sets, repsMin: s.repsMin, repsMax: s.repsMax, restSec: s.restSec, perSide: s.perSide ?? base.perSide }
  const implement = isImplement(s.implement) ? s.implement : 'maquina'
  return {
    id: s.id,
    name: s.name,
    sets: s.sets,
    repsMin: s.repsMin,
    repsMax: s.repsMax,
    perSide: s.perSide,
    restSec: s.restSec,
    implement,
    step: STEP[implement],
    note: '',
    cues: GENERIC_CUES,
    search: `${s.name} técnica correcta`,
  }
}

export const resolveRoutine = (r: StoredRoutine): Routine => ({
  id: r.id,
  name: r.name,
  days: r.days.map((d, i) => ({ id: d.id, n: i + 1, name: d.name, focus: '', summary: '', exercises: d.exercises.map(toExercise) })),
})

/** El Exercise del catálogo o el valor por defecto con el que se agrega a un día. */
export function toStored(e: Exercise): StoredEx {
  return { id: e.id, name: e.name, sets: e.sets, repsMin: e.repsMin, repsMax: e.repsMax, restSec: e.restSec, implement: e.implement, perSide: e.perSide }
}

// ---- estado en memoria (se carga al abrir la app) ----
let routines: Routine[] = [BASE]
let activeId = BASE_ID

export async function initRoutines(): Promise<void> {
  const stored = await db.routines.toArray()
  routines = [BASE, ...stored.sort((a, b) => a.createdAt - b.createdAt).map(resolveRoutine)]
  const id = await getMeta<string>('activeRoutine')
  activeId = routines.some((r) => r.id === id) ? (id as string) : BASE_ID
}

export const allRoutines = () => routines
export const activeRoutine = (): Routine => routines.find((r) => r.id === activeId) ?? BASE
export const storedRoutine = (id: string) => db.routines.get(id)

export async function setActiveRoutine(id: string) {
  await setMeta('activeRoutine', id)
  await initRoutines()
}

export async function saveRoutine(r: StoredRoutine, makeActive = false) {
  await db.routines.put(r)
  if (makeActive) await setMeta('activeRoutine', r.id)
  await initRoutines()
}

export async function deleteRoutine(id: string) {
  await db.routines.delete(id)
  await initRoutines()
}

export const newRoutineId = () => `r-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

// ---- búsquedas sobre todas las rutinas (el historial puede ser de otra rutina) ----
export const dayById = (id: string): Day | undefined => routines.flatMap((r) => r.days).find((d) => d.id === id)

export function exerciseById(id: string): Exercise | undefined {
  for (const r of [activeRoutine(), ...routines]) for (const d of r.days) for (const e of d.exercises) if (e.id === id) return e
  return catalogById(id)
}

export function locateExercise(id: string): { routine: Routine; day: Day } | undefined {
  for (const r of [activeRoutine(), ...routines]) for (const d of r.days) if (d.exercises.some((e) => e.id === id)) return { routine: r, day: d }
  return undefined
}

// ---- compartir por enlace: la rutina viaja dentro del enlace, no pasa por ningún servidor ----
type Row = [string, string, number, number, number, number, string?, number?]
interface Share {
  v: 1
  n: string
  d: { n: string; e: Row[] }[]
}

const b64 = (s: string) => {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const unb64 = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

export function encodeRoutine(r: { name: string; days: StoredDay[] }): string {
  const share: Share = {
    v: 1,
    n: r.name,
    d: r.days.map((d) => ({
      n: d.name,
      e: d.exercises.map((e): Row => [e.id, e.name, e.sets, e.repsMin, e.repsMax, e.restSec, e.implement, e.perSide ? 1 : 0]),
    })),
  }
  return b64(JSON.stringify(share))
}

const clean = (s: unknown, max = 60) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '')
const num = (v: unknown, lo: number, hi: number, d: number) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : d
}

/** Lee y limpia una rutina recibida por enlace. Devuelve null si no sirve. */
export function decodeRoutine(payload: string): StoredRoutine | null {
  try {
    const s = JSON.parse(unb64(payload)) as Share
    if (s.v !== 1 || !Array.isArray(s.d) || s.d.length === 0 || s.d.length > 14) return null
    const id = newRoutineId()
    const days: StoredDay[] = []
    for (const [i, d] of s.d.entries()) {
      const exercises: StoredEx[] = []
      for (const row of (d.e ?? []).slice(0, 25)) {
        const name = clean(row[1])
        if (!name) continue
        const cat = catalogById(clean(row[0], 60))
        const exId = cat ? cat.id : exerciseIdFor(name)
        const rmin = num(row[3], 1, 99, 8)
        exercises.push({
          id: exId,
          name: cat ? cat.name : name,
          sets: num(row[2], 1, 10, 3),
          repsMin: rmin,
          repsMax: Math.max(rmin, num(row[4], 1, 99, 12)),
          restSec: num(row[5], 15, 600, 90),
          implement: isImplement(row[6]) ? row[6] : undefined,
          perSide: row[7] ? true : undefined,
        })
      }
      if (exercises.length) days.push({ id: `${id}-d${i + 1}`, name: clean(d.n, 40) || `Día ${i + 1}`, exercises })
    }
    if (!days.length) return null
    return { id, name: clean(s.n, 40) || 'Rutina recibida', days, createdAt: Date.now() }
  } catch {
    return null
  }
}

export const shareUrl = (r: StoredRoutine) => `${location.origin}/#/importar/${encodeRoutine(r)}`
