import { useEffect, useState } from 'preact/hooks'
import { db, type SetLog } from '../db'
import { dayById, exerciseById } from '../data/routine'
import { Icon } from '../components/Icon'
import { kg, minutes } from '../lib/format'
import { volume } from '../lib/progression'

interface Summary {
  dayName: string
  n: number
  ms: number
  sets: number
  vol: number
  records: { name: string; weight: number }[]
}

export function Fin({ id }: { id: number }) {
  const [s, setS] = useState<Summary | null>(null)

  useEffect(() => {
    void (async () => {
      const ses = await db.sessions.get(id)
      if (!ses) return
      const sets = await db.sets.where('sessionId').equals(id).toArray()
      const day = dayById(ses.dayId)
      const byEx = new Map<string, SetLog[]>()
      for (const x of sets) byEx.set(x.exerciseId, [...(byEx.get(x.exerciseId) ?? []), x])
      const records: Summary['records'] = []
      for (const [exId, mine] of byEx) {
        const before = (await db.sets.where('exerciseId').equals(exId).toArray()).filter((x) => x.sessionId < id)
        if (!before.length) continue
        const prevMax = Math.max(...before.map((x) => x.weightKg))
        const nowMax = Math.max(...mine.map((x) => x.weightKg))
        if (nowMax > prevMax) records.push({ name: exerciseById(exId)?.name ?? exId, weight: nowMax })
      }
      const last = sets.length ? Math.max(...sets.map((x) => x.doneAt)) : ses.startedAt
      setS({ dayName: day?.name ?? '', n: day?.n ?? 0, ms: last - ses.startedAt, sets: sets.length, vol: volume(sets), records })
    })()
  }, [id])

  if (!s) return <main class="screen nobar" />

  return (
    <main class="screen nobar">
      <h1 class="d h1" style={{ marginTop: '28px' }}>Día terminado</h1>
      <p class="mut" style={{ marginTop: '8px' }}>Día {s.n}, {s.dayName}</p>

      <dl class="rows">
        <div><dt>Duración</dt><dd>{minutes(s.ms)}</dd></div>
        <div><dt>Series</dt><dd>{s.sets}</dd></div>
        <div><dt>Volumen</dt><dd>{kg(Math.round(s.vol))}<small>kg</small></dd></div>
      </dl>

      <h2 class="d h2">{s.records.length ? 'Subiste el peso en' : 'Sin récords nuevos hoy'}</h2>
      {s.records.length > 0 ? (
        <ul class="recs">
          {s.records.map((r) => (
            <li key={r.name}>
              <Icon n="up" />
              <span class="nm">{r.name}</span>
              <span class="d" style={{ fontSize: '26px' }}>{kg(r.weight)} kg</span>
            </li>
          ))}
        </ul>
      ) : (
        <p class="mut" style={{ marginTop: '10px' }}>Está bien. Repetir el peso con buena técnica también es progreso.</p>
      )}

      <div class="spacer" />
      <a class="btn" href="#/">Volver a la semana</a>
    </main>
  )
}
