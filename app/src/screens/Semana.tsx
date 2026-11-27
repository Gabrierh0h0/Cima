import { useEffect, useState } from 'preact/hooks'
import { db, ensureInstalledAt, getMeta, type Session } from '../db'
import { ROUTINE, type Exercise } from '../data/routine'
import { Icon, Mark } from '../components/Icon'
import { HowTo } from '../components/HowTo'
import { isStandalone } from '../lib/device'
import { repsLabel, weekStart } from '../lib/format'

const DAY_MS = 86_400_000
const BACKUP_EVERY = 14 * DAY_MS

export function Semana() {
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [installedAt, setInstalledAt] = useState(Date.now())
  const [lastBackup, setLastBackup] = useState<number | undefined>()
  const [pick, setPick] = useState<number | null>(null)
  const [how, setHow] = useState<Exercise | null>(null)

  useEffect(() => {
    void (async () => {
      setInstalledAt(await ensureInstalledAt())
      setLastBackup(await getMeta<number>('lastBackupAt'))
      setSessions(await db.sessions.orderBy('startedAt').toArray())
    })()
  }, [])

  if (!sessions) return <main class="screen" />

  const now = Date.now()
  const finished = sessions.filter((s) => s.finishedAt)
  const open = [...sessions].reverse().find((s) => !s.finishedAt && now - s.startedAt < 12 * 3600_000)
  const lastDone = finished[finished.length - 1]
  const lastN = lastDone ? ROUTINE.findIndex((d) => d.id === lastDone.dayId) : -1
  const suggested = open ? ROUTINE.findIndex((d) => d.id === open.dayId) : (lastN + 1) % ROUTINE.length
  const sel = pick ?? suggested
  const day = ROUTINE[sel]
  const ws = weekStart(now)
  const doneThisWeek = new Set(finished.filter((s) => s.finishedAt! >= ws).map((s) => s.dayId))
  const week = Math.floor((now - installedAt) / (7 * DAY_MS)) + 1
  const needBackup = finished.length > 0 && now - (lastBackup ?? installedAt) > BACKUP_EVERY
  const showInstall = !isStandalone()
  const resuming = open && sel === suggested

  return (
    <main class="screen">
      <div class="top">
        <span class="brand">
          <Mark s={22} />
          Cima
        </span>
        <span class="weeklabel">Semana {week}</span>
      </div>

      {(needBackup || showInstall) && (
        <a class="note-card" href={needBackup ? '#/ajustes' : '#/instalar'}>
          <Icon n={needBackup ? 'download' : 'plusbox'} s={20} />
          <span class="tx">{needBackup ? 'Guarda un respaldo de tu progreso' : 'Instala Cima para no perder tu progreso'}</span>
          <Icon n="chev" s={20} />
        </a>
      )}

      <nav class="strip" aria-label="Días de la semana">
        {ROUTINE.map((d, i) => (
          <button key={d.id} aria-pressed={i === sel} class={doneThisWeek.has(d.id) ? 'done' : ''} onClick={() => setPick(i)} aria-label={`Día ${d.n}, ${d.name}${doneThisWeek.has(d.id) ? ', hecho' : ''}`}>
            <span class="d">{d.n}</span>
            <span class="st">{doneThisWeek.has(d.id) ? <Icon n="check" s={14} sw={2.25} /> : i === suggested ? 'hoy' : ''}</span>
          </button>
        ))}
      </nav>

      <section class="hero">
        <h1 class="d big">Día {day.n}</h1>
        <p class="d name">{day.name}</p>
        <p class="focus">{day.focus}</p>
      </section>

      <ul class="list">
        {day.exercises.map((e, i) => (
          <li key={e.id}>
            <button onClick={() => setHow(e)} aria-label={`${e.name}, ${e.sets} series de ${repsLabel(e.repsMin, e.repsMax)}. Ver cómo se hace`}>
              <span class="idx">{i + 1}</span>
              <span class="nm">{e.name}</span>
              <span class="sr">
                {e.sets} × {repsLabel(e.repsMin, e.repsMax)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div class="spacer" />
      <div class="cta-wrap">
        <a class="btn" href={`#/sesion/${day.id}`}>
          {resuming ? 'Seguir el día' : 'Empezar'}
        </a>
      </div>

      <TabBar active="semana" />
      {how && <HowTo ex={how} onClose={() => setHow(null)} />}
    </main>
  )
}

export function TabBar({ active }: { active: 'semana' | 'progreso' | 'guia' | 'ajustes' }) {
  const t: [string, string, 'cal' | 'chart' | 'book' | 'cog', string][] = [
    ['semana', '#/', 'cal', 'Semana'],
    ['progreso', '#/progreso', 'chart', 'Progreso'],
    ['guia', '#/guia', 'book', 'Guía'],
    ['ajustes', '#/ajustes', 'cog', 'Ajustes'],
  ]
  return (
    <nav class="tabs" aria-label="Secciones">
      {t.map(([k, href, ic, label]) => (
        <a key={k} href={href} aria-current={k === active ? 'page' : undefined}>
          <Icon n={ic} />
          {label}
        </a>
      ))}
    </nav>
  )
}
