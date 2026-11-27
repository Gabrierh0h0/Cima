import { describe, expect, it } from 'vitest'
import { perSide } from './plates'
import { suggestRaise } from './progression'
import { ALL_EXERCISES, ROUTINE } from '../data/routine'

describe('discos por lado', () => {
  it('barra vacía no lleva discos', () => expect(perSide(20)).toEqual([]))
  it('60 kg: 20 por lado', () => expect(perSide(60)).toEqual([20]))
  it('92.5 kg: 25 + 10 + 1.25', () => expect(perSide(92.5)).toEqual([25, 10, 1.25]))
  it('45 kg: 10 + 2.5', () => expect(perSide(45)).toEqual([10, 2.5]))
})

describe('aviso de subir peso', () => {
  const t = { sets: 4, repsMax: 10, step: 2.5 }
  const s = (w: number, r: number) => ({ weightKg: w, reps: r })
  it('sugiere cuando todas las series llegan al tope con el mismo peso', () => {
    expect(suggestRaise(t, [s(60, 10), s(60, 10), s(60, 10), s(60, 10)])).toBe(62.5)
  })
  it('no sugiere si falta alguna repetición', () => {
    expect(suggestRaise(t, [s(60, 10), s(60, 9), s(60, 10), s(60, 10)])).toBeNull()
  })
  it('no sugiere si cambió el peso entre series', () => {
    expect(suggestRaise(t, [s(60, 10), s(65, 10), s(60, 10), s(60, 10)])).toBeNull()
  })
  it('no sugiere si faltaron series', () => {
    expect(suggestRaise(t, [s(60, 10), s(60, 10)])).toBeNull()
  })
})

describe('rutina', () => {
  it('tiene 5 días, 29 entradas y 28 ejercicios distintos', () => {
    expect(ROUTINE).toHaveLength(5)
    expect(ROUTINE.flatMap((d) => d.exercises)).toHaveLength(29)
    expect(ALL_EXERCISES).toHaveLength(28)
  })
  it('cada ejercicio tiene tres pistas', () => {
    for (const e of ALL_EXERCISES) expect(e.cues.length).toBe(3)
  })
})
