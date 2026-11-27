import { useEffect, useRef, useState } from 'preact/hooks'
import { db, lastSetsFor, type SetLog } from '../db'
import { dayById, type Exercise, type Implement } from '../data/routine'
import { Barbell } from '../components/Barbell'
import { HowTo } from '../components/HowTo'
import { Icon } from '../components/Icon'
import { beep, holdScreen, unlockAudio } from '../lib/device'
import { clock, kg, repsLabel } from '../lib/format'
import { suggestRaise } from '../lib/progression'
import { describePlates, perSide } from '../lib/plates'

const UNIT: Record<Implement, string> = {
  barra: 'kg en total, con barra de 20',
  mancuernas: 'kg por mancuerna',
  maquina: 'kg en la máquina',
  polea: 'kg en la polea',
  cuerpo: 'kg de lastre (0 es tu peso)',
}
const START: Record<Implement, number> = { barra: 20, mancuernas: 4, maquina: 20, polea: 10, cuerpo: 0 }
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function Sesion({ dayId }: { dayId: string }) {
  const day = dayById(dayId)
  const [ready, setReady] = useState(false)
  const [sessionId, setSessionId] = useState<number | undefined>()
  const [exIdx, setExIdx] = useState(0)
  const [done, setDone] = useState<Record<string, number>>({})
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(10)
  const [prev, setPrev] = useState<SetLog[]>([])
  const [restEnd, setRestEnd] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [how, setHow] = useState<Exercise | null>(null)
  const beeped = useRef(false)
  const busy = useRef(false)

  // abrir o retomar la sesión
  useEffect(() => {
    if (!day) return
    void (async () => {
      const all = await db.sessions.where('dayId').equals(day.id).toArray()
      const open = all.filter((s) => !s.finishedAt && Date.now() - s.startedAt < 12 * 3600_000).pop()
      let counts: Record<string, number> = {}
      if (open?.id) {
        setSessionId(open.id)
        const sets = await db.sets.where('sessionId').equals(open.id).toArray()
        for (const s of sets) counts[s.exerciseId] = Math.max(counts[s.exerciseId] ?? 0, s.setNo)
        setDone(counts)
        const next = day.exercises.findIndex((e) => (counts[e.id] ?? 0) < e.sets)
        setExIdx(next === -1 ? 0 : next)
      }
      setReady(true)
    })()
  }, [dayId])

  // pantalla encendida durante la sesión
  useEffect(() => {
    holdScreen(true)
    return () => holdScreen(false)
  }, [])

  // temporizador con hora de fin
  useEffect(() => {
    if (restEnd === null) return
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [restEnd])
  const left = restEnd === null ? null : (restEnd - now) / 1000
  useEffect(() => {
    if (left !== null && left <= 0 && !beeped.current) {
      beeped.current = true
      beep()
    }
  }, [left])

  const ex = day?.exercises[exIdx]
  const setIdx = ex ? Math.min(done[ex.id] ?? 0, ex.sets - 1) : 0

  // precarga desde la sesión anterior
  useEffect(() => {
    if (!ex || !ready) return
    void (async () => {
      const last = await lastSetsFor(ex.id, sessionId)
      setPrev(last)
      const mine = sessionId ? await db.sets.where({ sessionId, exerciseId: ex.id }).toArray() : []
      const lastMine = mine.sort((a, b) => a.setNo - b.setNo).pop()
      const ref = lastMine ?? last[setIdx] ?? last[last.length - 1]
      setWeight(ref?.weightKg ?? START[ex.implement])
      setReps(ref?.reps ?? ex.repsMax)
    })()
  }, [ex?.id, setIdx, ready, sessionId])

  if (!day || !ex) return <main class="screen nobar"><p>No encontré este día.</p><a class="btn" href="#/">Volver</a></main>
  if (!ready) return <main class="screen nobar" />

  const raise = setIdx === 0 && !(done[ex.id] ?? 0) ? suggestRaise(ex, prev) : null
  const lastSet = prev[setIdx] ?? prev[prev.length - 1]

  const finish = async (sid: number) => {
    const sets = await db.sets.where('sessionId').equals(sid).toArray()
    const end = sets.length ? Math.max(...sets.map((s) => s.doneAt)) : Date.now()
    await db.sessions.update(sid, { finishedAt: end })
    location.hash = `#/fin/${sid}`
  }

  const advance = (counts: Record<string, number>, from: number) => {
    if ((counts[day.exercises[from].id] ?? 0) < day.exercises[from].sets) return from
    const order = [...day.exercises.keys()]
    const next = order.slice(from + 1).find((i) => (counts[day.exercises[i].id] ?? 0) < day.exercises[i].sets)
    return next ?? order.find((i) => (counts[day.exercises[i].id] ?? 0) < day.exercises[i].sets)
  }

  const logSet = async () => {
    if (busy.current) return
    busy.current = true
    try {
      await doLog()
    } finally {
      busy.current = false
    }
  }

  const doLog = async () => {
    unlockAudio()
    let sid = sessionId
    if (!sid) {
      sid = await db.sessions.add({ dayId: day.id, startedAt: Date.now() })
      setSessionId(sid)
    }
    const no = (done[ex.id] ?? 0) + 1
    await db.sets.add({ sessionId: sid, exerciseId: ex.id, setNo: no, weightKg: weight, reps, doneAt: Date.now() })
    const counts = { ...done, [ex.id]: no }
    setDone(counts)
    const next = advance(counts, exIdx)
    if (next === undefined) {
      await finish(sid)
      return
    }
    beeped.current = false
    setRestEnd(Date.now() + ex.restSec * 1000)
    setNow(Date.now())
    setExIdx(next)
  }

  const skip = async () => {
    const counts = { ...done, [ex.id]: ex.sets }
    const next = advance(counts, exIdx)
    if (next === undefined) {
      if (sessionId) await finish(sessionId)
      else location.hash = '#/'
      return
    }
    setDone(counts)
    setExIdx(next)
  }

  const bump = (v: number, d: number, lo: number, hi: number, set: (n: number) => void) => set(clamp(Math.round((v + d) * 100) / 100, lo, hi))
  const exitDay = () => (location.hash = '#/')

  return (
    <main class="screen nobar">
      <div class="s-top">
        <button class="icon-btn" onClick={exitDay} aria-label="Salir del día">
          <Icon n="x" />
        </button>
        {left !== null && (
          <button class={`rest-chip ${left <= 0 ? 'ready' : ''}`} onClick={() => setRestEnd(null)} aria-label={left > 0 ? `Descanso, quedan ${clock(left)}. Tocar para omitir` : 'Descanso terminado'}>
            <Icon n="clock" s={20} />
            {left > 0 ? `Descanso ${clock(left)}` : 'Listo, siguiente serie'}
          </button>
        )}
      </div>

      <div class="segs" aria-label={`Ejercicio ${exIdx + 1} de ${day.exercises.length}`}>
        {day.exercises.map((e, i) => (
          <i key={e.id} class={(done[e.id] ?? 0) >= e.sets ? 'done' : i === exIdx ? 'cur' : ''} />
        ))}
      </div>

      <h1 class="d s-name">{ex.name}</h1>
      <p class="s-meta">
        Serie {setIdx + 1} de {ex.sets} · {repsLabel(ex.repsMin, ex.repsMax)} repeticiones{ex.perSide ? ' por lado' : ''}
      </p>
      <div class="dots" aria-hidden="true">
        {Array.from({ length: ex.sets }, (_, i) => (
          <i key={i} class={i < (done[ex.id] ?? 0) ? 'done' : i === setIdx ? 'cur' : ''} />
        ))}
      </div>

      <div class="bar">
        {ex.implement === 'barra' ? (
          <>
            <Barbell total={weight} />
            <p class="prev plates-cap">{perSide(weight).length ? `Por lado ${describePlates(weight).replace(/ \+ /g, ' + ')} kg` : 'Solo la barra'} · barra 20 kg</p>
          </>
        ) : (
          <div class="cue-box">
            <p class="d">{ex.cues[0]}</p>
          </div>
        )}
      </div>

      <div class="stepper w-row">
        <button class="step-btn" onClick={() => bump(weight, -ex.step, 0, 400, setWeight)} aria-label="Bajar peso">
          <Icon n="minus" s={28} />
        </button>
        <label class="val d">
          <input class="d" style={{ fontSize: 'inherit' }} inputMode="decimal" value={kg(weight)} aria-label="Peso en kilos" onFocus={(e) => (e.target as HTMLInputElement).select()} onChange={(e) => { const n = parseFloat((e.target as HTMLInputElement).value.replace(',', '.')); if (!Number.isNaN(n)) setWeight(clamp(n, 0, 400)) }} />
        </label>
        <button class="step-btn" onClick={() => bump(weight, ex.step, 0, 400, setWeight)} aria-label="Subir peso">
          <Icon n="plus" s={28} />
        </button>
      </div>
      <p class="prev">{UNIT[ex.implement]}</p>

      <div class="stepper r-row">
        <button class="step-btn" onClick={() => bump(reps, -1, 0, 99, setReps)} aria-label="Una repetición menos">
          <Icon n="minus" s={28} />
        </button>
        <div class="val d">
          {reps}
          <span class="u">reps</span>
        </div>
        <button class="step-btn" onClick={() => bump(reps, 1, 0, 99, setReps)} aria-label="Una repetición más">
          <Icon n="plus" s={28} />
        </button>
      </div>

      {lastSet ? (
        <p class="prev">
          La vez anterior: {kg(lastSet.weightKg)} kg × {lastSet.reps}
        </p>
      ) : (
        <p class="prev">Primera vez con este ejercicio</p>
      )}

      {raise && (
        <div class="raise">
          <Icon n="up" s={20} />
          <span>Completaste todas las series la vez pasada. Prueba {kg(raise)} kg.</span>
          <button onClick={() => setWeight(raise)}>Usar</button>
        </div>
      )}

      <div class="s-foot">
        <button class="btn" onClick={() => void logSet()}>
          <Icon n="check" s={26} sw={2.25} />
          Serie hecha
        </button>
        <button class="link" onClick={() => setHow(ex)}>
          <Icon n="video" s={20} />
          Ver cómo se hace
        </button>
        <button class="link mut" onClick={() => void skip()}>
          Saltar este ejercicio
        </button>
      </div>
      {how && <HowTo ex={how} onClose={() => setHow(null)} />}
    </main>
  )
}
