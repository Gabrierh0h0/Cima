import { useEffect, useState } from 'preact/hooks'
import { db, type StoredRoutine } from '../db'
import {
  allRoutines,
  activeRoutine,
  decodeRoutine,
  deleteRoutine,
  initRoutines,
  newRoutineId,
  saveRoutine,
  setActiveRoutine,
  shareUrl,
  toStored,
  type Routine,
} from '../lib/routines'
import { Icon } from '../components/Icon'
import { Back } from '../components/Back'

const toStoredRoutine = (r: Routine, id = newRoutineId(), name = r.name): StoredRoutine => ({
  id,
  name,
  createdAt: Date.now(),
  days: r.days.map((d, i) => ({ id: `${id}-d${i + 1}`, name: d.name, exercises: d.exercises.map(toStored) })),
})

const count = (r: Routine) => r.days.reduce((n, d) => n + d.exercises.length, 0)

/** #/rutinas: lista, elegir cuál usar, crear, duplicar, compartir y borrar. */
export function Rutinas() {
  const [, bump] = useState(0)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const refresh = async () => {
    await initRoutines()
    bump((n) => n + 1)
  }
  useEffect(() => void refresh(), [])

  const active = activeRoutine().id
  const share = async (r: Routine) => {
    const stored = r.builtin ? toStoredRoutine(r) : await db.routines.get(r.id)
    if (!stored) return
    const url = shareUrl(stored)
    const text = `Mi rutina en Cima: ${r.name}`
    try {
      if (navigator.share) await navigator.share({ title: 'Rutina de Cima', text, url })
      else {
        await navigator.clipboard.writeText(url)
        setMsg('Enlace copiado. Pégalo en un mensaje.')
      }
    } catch {
      /* cancelado */
    }
  }

  return (
    <main class="screen nobar">
      <Back fallback="#/ajustes" />
      <div class="top" style={{ marginTop: '8px' }}><h1 class="d" style={{ fontSize: '40px' }}>Mis rutinas</h1></div>
      <p class="mut" style={{ marginTop: '6px' }}>Cada persona puede tener la suya. Compártela con un enlace.</p>

      <div class="group">
        {allRoutines().map((r) => (
          <div class="row routine" key={r.id}>
            <div class="r-head">
              <h2 class="d" style={{ fontSize: '26px' }}>{r.name}</h2>
              {r.id === active && <span class="tag">En uso</span>}
            </div>
            <p>{r.days.length} días · {count(r)} ejercicios</p>
            <div class="r-actions">
              {r.id !== active && (
                <button class="btn small" onClick={async () => { await setActiveRoutine(r.id); location.hash = '#/' }}>Usar esta</button>
              )}
              {!r.builtin && <a class="btn sec small" href={`#/rutinas/editar/${r.id}`}>Editar</a>}
              <button class="btn sec small" onClick={() => void share(r)}><Icon n="share" s={22} />Compartir</button>
              <button
                class="btn sec small"
                onClick={async () => {
                  const copy = toStoredRoutine(r, newRoutineId(), `${r.name} (copia)`)
                  await saveRoutine(copy)
                  location.hash = `#/rutinas/editar/${copy.id}`
                }}
              >
                Duplicar y editar
              </button>
              {!r.builtin &&
                (confirm === r.id ? (
                  <div class="confirm">
                    <p>Se borra esta rutina. Tu historial de series se conserva.</p>
                    <button class="btn danger small" onClick={async () => { await deleteRoutine(r.id); setConfirm(null); await refresh() }}>Sí, borrar</button>
                    <button class="btn sec small" onClick={() => setConfirm(null)}>Cancelar</button>
                  </div>
                ) : (
                  <button class="btn sec small danger" onClick={() => setConfirm(r.id)}><Icon n="trash" s={22} />Borrar</button>
                ))}
            </div>
          </div>
        ))}
      </div>
      {msg && <p class="msg" role="status" style={{ marginTop: '12px' }}>{msg}</p>}

      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <a class="btn" href="#/rutinas/editar/nueva"><Icon n="plus" s={26} />Crear mi rutina</a>
      </div>
    </main>
  )
}

/** #/importar/<código>: vista previa de una rutina recibida por enlace. */
export function Importar({ payload }: { payload: string }) {
  const routine = decodeRoutine(payload)
  const [busy, setBusy] = useState(false)

  if (!routine)
    return (
      <main class="screen nobar">
        <h1 class="d" style={{ fontSize: '40px', marginTop: '28px' }}>Enlace no válido</h1>
        <p class="mut" style={{ marginTop: '10px' }}>No pude leer esta rutina. Pide que te manden el enlace de nuevo, completo.</p>
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}><a class="btn" href="#/">Ir a mi semana</a></div>
      </main>
    )

  return (
    <main class="screen nobar">
      <p class="mut" style={{ marginTop: '28px' }}>Te compartieron una rutina</p>
      <h1 class="d" style={{ fontSize: '44px', marginTop: '6px' }}>{routine.name}</h1>
      <div class="group">
        {routine.days.map((d, i) => (
          <div class="row" key={d.id}>
            <h2 class="d" style={{ fontSize: '24px' }}>Día {i + 1}, {d.name}</h2>
            <p>{d.exercises.map((e) => e.name).join(' · ')}</p>
          </div>
        ))}
      </div>
      <p class="mut" style={{ marginTop: '12px', fontSize: '14px' }}>
        No la revisamos: Cima no la creó. Si algo te duele o no te sirve, cámbiala. Aplica el Aviso de salud.
      </p>
      <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          class="btn"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            await saveRoutine(routine, true)
            location.hash = '#/'
          }}
        >
          Guardar y usar
        </button>
        <a class="btn sec small" href="#/">No, gracias</a>
      </div>
    </main>
  )
}
