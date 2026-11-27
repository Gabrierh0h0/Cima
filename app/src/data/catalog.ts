// Catálogo de ejercicios: los 28 de la rutina base más los que se pueden elegir al armar una rutina.
// El historial se enlaza por `id`: nunca cambies un id que ya se haya usado.
import { ROUTINE, type Exercise, type Implement } from './routine'

const ex = (e: Exercise): Exercise => e

/** Ejercicios que no están en la rutina base. youtubeId se agrega cuando se verifica el video. */
export const EXTRA: Exercise[] = [
  ex({ id: 'press-pecho-maquina', name: 'Press de pecho en máquina', sets: 3, repsMin: 8, repsMax: 12, restSec: 150, implement: 'maquina', step: 5,
    note: 'Ajusta el asiento para que las manijas queden a la altura del pecho.',
    cues: ['Espalda y hombros pegados al respaldo.', 'Empuja sin bloquear los codos del todo.', 'Vuelve despacio hasta sentir el pecho estirado.'],
    search: 'press de pecho en máquina técnica', youtubeId: 'N7DjfGB8-xY' }),
  ex({ id: 'elevaciones-frontales', name: 'Elevaciones frontales', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'mancuernas', step: 1,
    note: 'Sube hasta la altura de los hombros, sin balancear el torso.',
    cues: ['Sube los brazos al frente hasta la altura del hombro.', 'No te balancees para ayudarte.', 'Baja despacio.'],
    search: 'elevaciones frontales con mancuernas técnica', youtubeId: 'joO2vLGujcA' }),
  ex({ id: 'curl-martillo-cuerda', name: 'Curl martillo con cuerda en polea', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'polea', step: 2.5,
    note: 'Agarre neutro con la cuerda y codos pegados al cuerpo.',
    cues: ['Palmas enfrentadas, codos pegados.', 'Sube sin mover los hombros.', 'Baja despacio sin soltar la tensión.'],
    search: 'curl martillo con cuerda en polea técnica', youtubeId: '54mQ9iCmmXQ' }),
  ex({ id: 'curl-barra-z', name: 'Curl de bíceps con barra Z', sets: 3, repsMin: 8, repsMax: 12, restSec: 90, implement: 'libre', step: 2.5,
    note: 'La barra Z cuida las muñecas. Mantén los codos quietos junto al cuerpo.',
    cues: ['Codos pegados al cuerpo y quietos.', 'Sube sin balancear la espalda.', 'Baja despacio hasta estirar el brazo.'],
    search: 'curl de bíceps con barra Z técnica', youtubeId: 'jkwxFce71ao' }),
  ex({ id: 'curl-predicador', name: 'Curl predicador', sets: 3, repsMin: 8, repsMax: 12, restSec: 90, implement: 'libre', step: 2.5,
    note: 'Apoya bien los brazos en el banco y no rebotes abajo.',
    cues: ['Brazos apoyados en el banco.', 'No rebotes abajo ni estires de golpe.', 'Sube apretando el bíceps.'],
    search: 'curl predicador técnica bíceps', youtubeId: 'lXbs6as_TvA' }),
  ex({ id: 'remo-polea-cerrado', name: 'Remo en polea con agarre cerrado', sets: 3, repsMin: 10, repsMax: 12, restSec: 120, implement: 'polea', step: 2.5,
    note: 'Tira del agarre hacia el abdomen con la espalda recta y sin balancearte.',
    cues: ['Espalda recta, pecho arriba.', 'Lleva los codos hacia atrás pegados al cuerpo.', 'Vuelve despacio estirando los brazos.'],
    search: 'remo en polea baja agarre cerrado técnica', youtubeId: 'mj48hqtyoxg' }),
  ex({ id: 'rear-delt-polea', name: 'Deltoide posterior en polea, un brazo', sets: 3, repsMin: 12, repsMax: 15, perSide: true, restSec: 90, implement: 'polea', step: 1.25,
    note: 'Con la polea arriba, jala hacia atrás y afuera con un brazo a la vez.',
    cues: ['Jala hacia atrás y un poco hacia afuera.', 'Codo a la altura del hombro.', 'Vuelve despacio, sin soltar la tensión.'],
    search: 'deltoide posterior en polea un brazo técnica', youtubeId: 'lwIzav1snk4' }),
  ex({ id: 'crunch-lastre', name: 'Crunch abdominal con peso', sets: 3, repsMin: 12, repsMax: 15, restSec: 60, implement: 'cuerpo', step: 2.5,
    note: 'Sostén el peso junto a la cabeza y enrolla el torso, sin tirar del cuello.',
    cues: ['Enrolla el torso, no tires del cuello.', 'Exhala al subir y aprieta el abdomen.', 'Baja con control.'],
    search: 'crunch abdominal con peso técnica', youtubeId: 'EHbIRahkQ1s' }),
  ex({ id: 'crunch-abdominal', name: 'Crunch abdominal', sets: 3, repsMin: 15, repsMax: 20, restSec: 60, implement: 'cuerpo', step: 2.5,
    note: 'Movimiento corto y controlado, sin jalar la cabeza con las manos.',
    cues: ['Sube solo hasta despegar los omóplatos.', 'No jales la cabeza con las manos.', 'Exhala al subir.'],
    search: 'crunch abdominal técnica correcta', youtubeId: 'rpJMsUCzdCk' }),
]

const base = Array.from(new Map(ROUTINE.flatMap((d) => d.exercises).map((e) => [e.id, e])).values())

export const CATALOG: Exercise[] = [...base, ...EXTRA]

export const catalogById = (id: string) => CATALOG.find((e) => e.id === id)

export const IMPLEMENTS: [Implement, string][] = [
  ['maquina', 'Máquina'],
  ['polea', 'Polea'],
  ['mancuernas', 'Mancuernas'],
  ['barra', 'Barra olímpica'],
  ['libre', 'Barra Z / otro'],
  ['cuerpo', 'Peso corporal'],
]

/** Minúsculas y sin tildes, para buscar y comparar nombres. */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
