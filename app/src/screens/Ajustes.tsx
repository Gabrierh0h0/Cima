import { useEffect, useRef, useState } from 'preact/hooks'
import { db, getMeta } from '../db'
import { exportBackup, importBackup, wipeAll } from '../lib/backup'
import { Icon, Mark } from '../components/Icon'
import { TabBar } from './Semana'
import { shortDate } from '../lib/format'
import { isStandalone } from '../lib/device'

export function Ajustes() {
  const [last, setLast] = useState<number | undefined>()
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState<{ t: string; err?: boolean } | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [pending, setPending] = useState<File | null>(null)
  const file = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLast(await getMeta<number>('lastBackupAt'))
    setCount(await db.sessions.count())
  }
  useEffect(() => void load(), [])

  return (
    <main class="screen">
      <div class="top"><h1 class="d" style={{ fontSize: '40px' }}>Ajustes</h1></div>

      <div class="group">
        <div class="row">
          <h2 class="d" style={{ fontSize: '24px' }}>Respaldo</h2>
          <p>Tu progreso vive solo en este teléfono. Guarda un respaldo de vez en cuando por si cambias de celular.</p>
          <p>{last ? `Último respaldo: ${shortDate(last)}.` : 'Aún no has guardado un respaldo.'} {count === 1 ? "1 día registrado" : `${count} días registrados`}.</p>
          <button class="btn sec small" onClick={async () => { const ok = await exportBackup(); await load(); setMsg(ok ? { t: 'Respaldo listo.' } : null) }}>
            <Icon n="share" s={22} />Guardar respaldo
          </button>
          <button class="btn sec small" onClick={() => file.current?.click()}>
            <Icon n="upload" s={22} />Restaurar respaldo
          </button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => {
            const f = (e.target as HTMLInputElement).files?.[0]
            if (f) setPending(f)
            ;(e.target as HTMLInputElement).value = ''
          }} />
          {pending && (
            <div class="confirm">
              <p>Restaurar reemplaza todo lo que hay ahora en este teléfono con el contenido del archivo.</p>
              <button class="btn small" onClick={async () => {
                try { const n = await importBackup(pending); await load(); setMsg({ t: `Se restauraron ${n} días.` }) } catch (er) { setMsg({ t: (er as Error).message, err: true }) }
                setPending(null)
              }}>Sí, restaurar</button>
              <button class="btn sec small" onClick={() => setPending(null)}>Cancelar</button>
            </div>
          )}
          {msg && <p class={`msg ${msg.err ? 'err' : ''}`} role="status">{msg.t}</p>}
        </div>

        {!isStandalone() && (
          <div class="row">
            <h2 class="d" style={{ fontSize: '24px' }}>Instalar en el iPhone</h2>
            <p>Instalada, la app abre en pantalla completa y tu progreso queda protegido.</p>
            <a class="btn sec small" href="#/instalar">Ver cómo instalar</a>
          </div>
        )}

        <div class="row">
          <h2 class="d" style={{ fontSize: '24px' }}>Borrar datos</h2>
          <p>Elimina todos los días y series registrados en este teléfono. No se puede deshacer.</p>
          {confirmWipe ? (
            <>
              <button class="btn danger small" onClick={async () => { await wipeAll(); setConfirmWipe(false); await load(); setMsg({ t: 'Datos borrados.' }) }}>Sí, borrar todo</button>
              <button class="btn sec small" onClick={() => setConfirmWipe(false)}>Cancelar</button>
            </>
          ) : (
            <button class="btn sec small danger" onClick={() => setConfirmWipe(true)}><Icon n="trash" s={22} />Borrar datos</button>
          )}
        </div>
      </div>

      <div class="sign">
        <Mark s={16} c="var(--piedra)" />
        <span>Cima · Hecho por somospits.com.co</span>
      </div>
      <TabBar active="ajustes" />
    </main>
  )
}
