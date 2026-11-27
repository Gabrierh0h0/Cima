import { useEffect, useState } from 'preact/hooks'
import { db, type SetLog } from '../db'
import { ALL_EXERCISES, dayOfExercise } from '../data/routine'
import { LineChart, type Point } from '../components/Chart'
import { TabBar } from './Semana'
import { kg, shortDate } from '../lib/format'
import { suggestRaise } from '../lib/progression'

export function Progreso() {
  const [sets, setSets] = useState<SetLog[] | null>(null)

  useEffect(() => {
    void db.sets.toArray().then(setSets)
  }, [])

  if (!sets) return <main class="screen" />

  const cards = ALL_EXERCISES.map((e) => {
    const mine = sets.filter((s) => s.exerciseId === e.id)
    const bySession = new Map<number, SetLog[]>()
    for (const s of mine) bySession.set(s.sessionId, [...(bySession.get(s.sessionId) ?? []), s])
    const sessions = [...bySession.values()].sort((a, b) => a[0].doneAt - b[0].doneAt)
    return { e, sessions }
  })
  const withData = cards.filter((c) => c.sessions.length).length
  // primero los que ya tienen registros
  cards.sort((a, b) => Number(b.sessions.length > 0) - Number(a.sessions.length > 0))

  return (
    <main class="screen">
      <div class="top"><h1 class="d" style={{ fontSize: '40px' }}>Progreso</h1></div>
      <p class="mut" style={{ marginTop: '6px' }}>
        {withData === 0 ? 'Aquí verás cómo sube tu peso en cada ejercicio.' : 'Desliza para ver cada ejercicio.'}
      </p>

      <div class="snap" tabIndex={0} aria-label="Ejercicios">
        {cards.map(({ e, sessions }, idx) => {
          const points: Point[] = sessions.map((ss) => ({ label: shortDate(ss[0].doneAt), value: Math.max(...ss.map((x) => x.weightKg)) }))
          const best = sessions.flat().reduce<SetLog | null>((b, x) => (!b || x.weightKg > b.weightKg || (x.weightKg === b.weightKg && x.reps > b.reps) ? x : b), null)
          const last = sessions[sessions.length - 1] ?? []
          const raise = last.length ? suggestRaise(e, [...last].sort((a, b) => a.setNo - b.setNo)) : null
          return (
            <article class="card" key={e.id}>
              <h2 class="d">{e.name}</h2>
              <p class="day">Día {dayOfExercise(e.id)?.n}, {dayOfExercise(e.id)?.name} · {idx + 1} de {cards.length}</p>
              {sessions.length === 0 ? (
                <p class="empty">Aún no hay registros de este ejercicio.</p>
              ) : (
                <>
                  <div class="chart"><LineChart points={points} name={e.name} /></div>
                  <dl class="rows">
                    <div><dt>Mejor marca</dt><dd>{kg(best!.weightKg)}<small>kg × {best!.reps}</small></dd></div>
                    <div><dt>Última vez</dt><dd>{kg(Math.max(...last.map((x) => x.weightKg)))}<small>kg</small></dd></div>
                    <div><dt>Próximo objetivo</dt><dd>{raise ? <>{kg(raise)}<small>kg</small></> : <small>repetir el peso</small>}</dd></div>
                  </dl>
                </>
              )}
            </article>
          )
        })}
      </div>
      <TabBar active="progreso" />
    </main>
  )
}
