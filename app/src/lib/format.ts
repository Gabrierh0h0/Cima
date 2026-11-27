const nf = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
export const kg = (n: number): string => nf.format(n)

export const clock = (sec: number): string => {
  const s = Math.max(0, Math.ceil(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export const minutes = (ms: number): string => `${Math.max(1, Math.round(ms / 60000))} min`

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const shortDate = (t: number): string => {
  const d = new Date(t)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** Lunes 00:00 de la semana de t. */
export const weekStart = (t: number): number => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.getTime()
}

export const repsLabel = (min: number, max: number): string => (min === max ? `${min}` : `${min}–${max}`)
