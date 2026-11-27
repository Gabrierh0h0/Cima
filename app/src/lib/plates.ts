export const BAR_KG = 20
export const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25] as const
export type Plate = (typeof PLATE_SIZES)[number]

/** Discos por lado, de mayor a menor, para un peso total con barra de 20 kg. */
export function perSide(total: number, bar = BAR_KG): Plate[] {
  let rest = (total - bar) / 2
  const out: Plate[] = []
  for (const p of PLATE_SIZES) {
    while (rest + 1e-9 >= p) {
      out.push(p)
      rest -= p
    }
  }
  return out
}

/** Colores de competencia, en tonos mates. */
export const PLATE_STYLE: Record<Plate, { fill: string; ink: string; h: number; w: number }> = {
  25: { fill: '#B4382E', ink: '#F4E9E6', h: 112, w: 20 },
  20: { fill: '#2D5C9B', ink: '#E9EEF6', h: 112, w: 18 },
  15: { fill: '#C7A126', ink: '#1B1A19', h: 112, w: 16 },
  10: { fill: '#3F7B50', ink: '#E8F0EA', h: 112, w: 14 },
  5: { fill: '#E3DED5', ink: '#1B1A19', h: 70, w: 11 },
  2.5: { fill: '#4A4642', ink: '#A39C93', h: 54, w: 9 },
  1.25: { fill: '#A8A39B', ink: '#1B1A19', h: 42, w: 7 },
}

export const describePlates = (total: number): string => {
  const ps = perSide(total)
  return ps.length ? ps.map((p) => `${p}`).join(' + ') : 'sin discos'
}
