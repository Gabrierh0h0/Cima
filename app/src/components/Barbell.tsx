import { describePlates, perSide, PLATE_STYLE } from '../lib/plates'

const W = 342
const H = 124

export function Barbell({ total }: { total: number }) {
  const ps = perSide(total)
  const c = W / 2
  const mid = H / 2
  const gap = Math.floor(W * 0.28)
  const parts: preact.JSX.Element[] = []

  for (const side of [-1, 1]) {
    let x = c + side * gap
    ps.forEach((p, i) => {
      const st = PLATE_STYLE[p]
      const rx = side === 1 ? x : x - st.w
      parts.push(
        <rect key={`${side}-${i}`} x={rx} y={mid - st.h / 2} width={st.w} height={st.h} rx="3" fill={st.fill} />,
      )
      if (p === 2.5) {
        parts.push(
          <rect key={`${side}-${i}s`} x={rx + 0.5} y={mid - st.h / 2 + 0.5} width={st.w - 1} height={st.h - 1} rx="2.5" fill="none" stroke="#6F6A63" />,
        )
      }
      if (st.h >= 100) {
        parts.push(
          <text
            key={`${side}-${i}t`}
            transform={`translate(${rx + st.w / 2 + 4.5} ${mid}) rotate(-90)`}
            text-anchor="middle"
            font-family="Barlow Condensed"
            font-weight="600"
            font-size="13"
            fill={st.ink}
          >
            {p}
          </text>,
        )
      }
      x += side * (st.w + 2)
    })
    const cx = side === 1 ? x : x - 8
    parts.push(<rect key={`c${side}`} x={cx} y={mid - 15} width="8" height="30" rx="2" fill="#57524C" />)
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Barra con ${total} kg: ${describePlates(total)} kg por lado`}>
      <rect x="0" y={mid - 4} width={W} height="8" rx="2" fill="#6F6A63" />
      <rect x={c - gap + 6} y={mid - 4} width={2 * gap - 12} height="8" fill="#8E8981" />
      {parts}
    </svg>
  )
}
