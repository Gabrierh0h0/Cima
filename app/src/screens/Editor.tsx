import { useEffect, useState } from 'preact/hooks'
import type { StoredEx, StoredRoutine } from '../db'
import { CATALOG, IMPLEMENTS, norm } from '../data/catalog'
import type { Implement } from '../data/routine'
import { exerciseIdFor, newRoutineId, saveRoutine, storedRoutine, toStored } from '../lib/routines'
import { Icon } from '../components/Icon'
import { Back } from '../components/Back'
import { repsLabel } from '../lib/format'

const rnd = () => Math.random().toString(36).slice(2, 7)
const move = <T,>(a: T[], i: number, d: number) => {
  const j = i + d
  if (j < 0 || j >= a.length) return a
  const c = [...a]
  ;[c[i], c[j]] = [c[j], c[i]]
  return c
}
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const blank = (): StoredRoutine => {
  const id = newRoutineId()
  return { id, name: '', createdAt: Date.now(), days: [{ id: `${id}-${rnd()}`, name: 'Día 1', exercises: [] }] }
}

function Num({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (n: number) => void }) {
  return (
    <div class="num-row">
      <span>{label}</span>
      <button class="mini" aria-label={`Menos ${label}`} onClick={() => onChange(clamp(value - step, min, max))}><Icon n="minus" s={22} /></button>
      <b class="d">{value}{unit}</b>
      <button class="mini" aria-label={`Más ${label}`} onClick={() => onChange(clamp(value + step, min, max))}><Icon n="plus" s={22} /></button>
    </div>
  )
}

/** Hoja para elegir un ejercicio del catálogo o crear uno nuevo con el nombre que la persona escriba. */
function Picker({ onPick, onClose }: { onPick: (e: StoredEx) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [impl, setImpl] = useState<Implement>('maquina')
  const nq = norm(q)
  const list = CATALOG.filter((e) => !nq || norm(e.name).includes(nq)).sort((a, b) => a.name.localeCompare(b.name, 'es')).slice(0, 40)
  const exact = CATALOG.some((e) => norm(e.name) === nq)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div class="sheet-wrap" onClick={onClose}>
      <section class="sheet" role="dialog" aria-modal="true" aria-label="Elegir ejercicio" onClick={(e) => e.stopPropagation()}>
        <header class="sheet-head">
          <h2 class="d">Añadir ejercicio</h2>
          <button class="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon n="x" /></button>
        </header>
        <input class="field" type="search" autofocus placeholder="Busca o escribe un nombre" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} aria-label="Buscar ejercicio" />

        {nq && !exact && (
          <div class="newex">
            <p>No está en la lista. Créalo como <b>«{q.trim()}»</b>. ¿Con qué se hace?</p>
            <div class="chips" role="radiogroup" aria-label="Implemento">
              {IMPLEMENTS.map(([k, label]) => (
                <button key={k} role="radio" aria-checked={impl === k} class={impl === k ? 'on' : ''} onClick={() => setImpl(k)}>{label}</button>
              ))}
            </div>
            <button class="btn small" onClick={() => onPick({ id: exerciseIdFor(q), name: q.trim(), sets: 3, repsMin: 8, repsMax: 12, restSec: 90, implement: impl })}>
              Crear y añadir
            </button>
          </div>
        )}

        <ul class="pick">
          {list.map((e) => (
            <li key={e.id}>
              <button onClick={() => onPick(toStored(e))}>
                <span>{e.name}</span>
                <small>{IMPLEMENTS.find(([k]) => k === e.implement)?.[1]}</small>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** #/rutinas/editar/<id> o /nueva: arma días y ejercicios, sin escribir código. */
export function Editor({ id }: { id: string }) {
  const [r, setR] = useState<StoredRoutine | null>(id === 'nueva' ? blank() : null)
  const [open, setOpen] = useState<string | null>(null) // `${dayId}:${index}`
  const [pickDay, setPickDay] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (id === 'nueva') return
    void storedRoutine(id).then((s) => (s ? setR(s) : setMissing(true)))
  }, [id])

  if (missing)
    return (
      <main class="screen nobar">
        <p>No encontré esta rutina.</p>
        <a class="btn" href="#/rutinas">Volver</a>
      </main>
    )
  if (!r) return <main class="screen nobar" />

  const patchDay = (dayId: string, f: (ex: StoredEx[]) => StoredEx[]) =>
    setR({ ...r, days: r.days.map((d) => (d.id === dayId ? { ...d, exercises: f(d.exercises) } : d)) })
  const patchEx = (dayId: string, i: number, p: Partial<StoredEx>) => patchDay(dayId, (ex) => ex.map((e, k) => (k === i ? { ...e, ...p } : e)))

  const total = r.days.reduce((n, d) => n + d.exercises.length, 0)
  const valid = r.name.trim().length > 0 && total > 0

  return (
    <main class="screen nobar editor">
      <Back label="Cancelar" fallback="#/rutinas" />
      <h1 class="d" style={{ fontSize: '40px', marginTop: '8px' }}>{id === 'nueva' ? 'Crear rutina' : 'Editar rutina'}</h1>

      <label class="lbl" for="rname">Nombre de la rutina</label>
      <input id="rname" class="field" maxLength={40} placeholder="Ej. Mi rutina de 3 días" value={r.name} onInput={(e) => setR({ ...r, name: (e.target as HTMLInputElement).value })} />

      {r.days.map((d, di) => (
        <section class="eday" key={d.id}>
          <div class="eday-head">
            <input class="field day-name" maxLength={40} aria-label={`Nombre del día ${di + 1}`} value={d.name} onInput={(e) => setR({ ...r, days: r.days.map((x) => (x.id === d.id ? { ...x, name: (e.target as HTMLInputElement).value } : x)) })} />
            <button class="mini" aria-label="Subir día" disabled={di === 0} onClick={() => setR({ ...r, days: move(r.days, di, -1) })}><Icon n="up" s={22} /></button>
            <button class="mini" aria-label="Bajar día" disabled={di === r.days.length - 1} onClick={() => setR({ ...r, days: move(r.days, di, 1) })}><Icon n="down" s={22} /></button>
            {r.days.length > 1 && (
              <button class="mini" aria-label="Quitar día" onClick={() => setR({ ...r, days: r.days.filter((x) => x.id !== d.id) })}><Icon n="trash" s={22} /></button>
            )}
          </div>

          <ul class="elist">
            {d.exercises.map((e, i) => {
              const key = `${d.id}:${i}`
              const isOpen = open === key
              return (
                <li key={key}>
                  <button class="erow" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
                    <span class="idx">{i + 1}</span>
                    <span class="nm">{e.name}</span>
                    <span class="sr">{e.sets} × {repsLabel(e.repsMin, e.repsMax)}</span>
                  </button>
                  {isOpen && (
                    <div class="epanel">
                      <Num label="Series" value={e.sets} min={1} max={10} onChange={(n) => patchEx(d.id, i, { sets: n })} />
                      <Num label="Reps desde" value={e.repsMin} min={1} max={99} onChange={(n) => patchEx(d.id, i, { repsMin: n, repsMax: Math.max(n, e.repsMax) })} />
                      <Num label="Reps hasta" value={e.repsMax} min={1} max={99} onChange={(n) => patchEx(d.id, i, { repsMax: n, repsMin: Math.min(n, e.repsMin) })} />
                      <Num label="Descanso" value={e.restSec} min={15} max={600} step={15} unit=" s" onChange={(n) => patchEx(d.id, i, { restSec: n })} />
                      <div class="epanel-actions">
                        <button class="btn sec small" disabled={i === 0} onClick={() => { patchDay(d.id, (ex) => move(ex, i, -1)); setOpen(`${d.id}:${i - 1}`) }}><Icon n="up" s={22} />Subir</button>
                        <button class="btn sec small" disabled={i === d.exercises.length - 1} onClick={() => { patchDay(d.id, (ex) => move(ex, i, 1)); setOpen(`${d.id}:${i + 1}`) }}><Icon n="down" s={22} />Bajar</button>
                        <button class="btn sec small danger" onClick={() => { patchDay(d.id, (ex) => ex.filter((_, k) => k !== i)); setOpen(null) }}><Icon n="trash" s={22} />Quitar</button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          <button class="btn sec small" onClick={() => setPickDay(d.id)}><Icon n="plus" s={22} />Añadir ejercicio</button>
        </section>
      ))}

      {r.days.length < 14 && (
        <button class="btn sec small" style={{ marginTop: '20px' }} onClick={() => setR({ ...r, days: [...r.days, { id: `${r.id}-${rnd()}`, name: `Día ${r.days.length + 1}`, exercises: [] }] })}>
          <Icon n="plusbox" s={22} />Añadir día
        </button>
      )}

      <div class="save-bar">
        <button
          class="btn"
          disabled={!valid}
          onClick={async () => {
            const days = r.days.filter((d) => d.exercises.length).map((d) => ({ ...d, name: d.name.trim() || 'Día' }))
            await saveRoutine({ ...r, name: r.name.trim(), days }, id === 'nueva')
            location.hash = id === 'nueva' ? '#/' : '#/rutinas'
          }}
        >
          Guardar rutina
        </button>
        {!valid && <p class="mut hint">Ponle nombre y añade al menos un ejercicio.</p>}
      </div>

      {pickDay && (
        <Picker
          onClose={() => setPickDay(null)}
          onPick={(e) => {
            patchDay(pickDay, (ex) => [...ex, e])
            setPickDay(null)
          }}
        />
      )}
    </main>
  )
}
