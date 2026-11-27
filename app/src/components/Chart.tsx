export interface Point {
  label: string
  value: number
}

const W = 342
const H = 180
const L = 36
const T = 12
const B = 24
const R = 22

export function LineChart({ points, unit = 'kg', name }: { points: Point[]; unit?: string; name: string }) {
  if (points.length === 0) return null
  const vals = points.map((p) => p.value)
  let lo = Math.min(...vals)
  let hi = Math.max(...vals)
  if (lo === hi) {
    lo -= 5
    hi += 5
  }
  const pad = (hi - lo) * 0.15
  const nice = hi - lo > 40 ? 20 : hi - lo > 20 ? 10 : 5
  lo = Math.max(0, Math.floor((lo - pad) / nice) * nice)
  hi = Math.ceil((hi + pad) / nice) * nice
  hi = lo + 3 * nice * Math.ceil((hi - lo) / (3 * nice))
  const n = points.length
  const X = (i: number) => (n === 1 ? L + (W - L - R) / 2 : L + ((W - L - R) * i) / (n - 1))
  const Y = (v: number) => T + (H - T - B) * (1 - (v - lo) / (hi - lo))
  const grid = [0, 1, 2, 3].map((i) => Math.round(lo + ((hi - lo) * i) / 3))
  const labelIdx = n <= 3 ? points.map((_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1]
  const line = points.map((p, i) => `${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`${name}, ${unit} por sesión, de ${points[0].value} a ${points[n - 1].value} ${unit}`}
    >
      {grid.map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={Y(g)} y2={Y(g)} stroke="rgba(242,238,232,.09)" />
          <text x="0" y={Y(g) + 4} font-family="Barlow" font-size="12" fill="#A39C93">
            {g}
          </text>
        </g>
      ))}
      {n > 1 && <polyline points={line} fill="none" stroke="#C8633F" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={X(i)}
          cy={Y(p.value)}
          r={i === n - 1 ? 5 : 3}
          fill={i === n - 1 ? '#C8633F' : '#141312'}
          stroke="#C8633F"
          stroke-width="2"
        />
      ))}
      {labelIdx.map((i) => (
        <text key={i} x={X(i)} y={H - 4} text-anchor={n > 1 && i === n - 1 ? 'end' : n > 1 && i === 0 ? 'start' : 'middle'} font-family="Barlow" font-size="12" fill="#A39C93">
          {points[i].label}
        </text>
      ))}
    </svg>
  )
}
