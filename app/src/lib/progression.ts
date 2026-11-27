export interface SetLite {
  weightKg: number
  reps: number
}

export interface Target {
  sets: number
  repsMax: number
  step: number
}

const roundTo = (v: number, step: number) => Math.round(v / step) * step

/**
 * Aviso de subir peso: todas las series del último día llegaron al tope de
 * repeticiones con el mismo peso. Sugiere entre 2.5 % y 5 %, redondeado al
 * incremento del implemento y nunca menos de un paso.
 */
export function suggestRaise(target: Target, last: SetLite[]): number | null {
  if (last.length < target.sets) return null
  const w = last[0].weightKg
  if (w <= 0) return null
  const same = last.every((s) => s.weightKg === w)
  const done = last.every((s) => s.reps >= target.repsMax)
  if (!same || !done) return null
  const next = Math.max(w + target.step, roundTo(w * 1.04, target.step))
  return Math.round(next * 100) / 100
}

export const volume = (sets: SetLite[]): number => sets.reduce((a, s) => a + s.weightKg * s.reps, 0)
