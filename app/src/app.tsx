import { useEffect, useState } from 'preact/hooks'
import { Semana } from './screens/Semana'
import { Sesion } from './screens/Sesion'
import { Fin } from './screens/Fin'
import { Progreso } from './screens/Progreso'
import { Guia } from './screens/Guia'
import { Ajustes } from './screens/Ajustes'
import { Instalar } from './screens/Instalar'
import { Aceptacion, Legal } from './screens/Legal'
import { getMeta } from './db'
import { LEGAL } from './data/legal'
import { Editor } from './screens/Editor'
import { Importar, Rutinas } from './screens/Rutinas'
import { initRoutines } from './lib/routines'

const useHash = () => {
  const [h, setH] = useState(location.hash || '#/')
  useEffect(() => {
    const on = () => {
      setH(location.hash || '#/')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return h
}

export function App() {
  const h = useHash()
  const [, a, b, c] = h.replace('#', '').split('/')
  // null = leyendo; false = falta aceptar los textos legales vigentes
  const [accepted, setAccepted] = useState<boolean | null>(null)
  useEffect(() => {
    void (async () => {
      await initRoutines()
      setAccepted((await getMeta<string>('legalVersion')) === LEGAL.version)
    })()
  }, [])

  if (a === 'legal') return <Legal id={b} />
  if (accepted === null) return <main class="screen nobar" />
  if (!accepted) return <Aceptacion onDone={() => setAccepted(true)} />

  switch (a) {
    case 'sesion':
      return <Sesion key={b} dayId={b} />
    case 'fin':
      return <Fin key={b} id={Number(b)} />
    case 'progreso':
      return <Progreso />
    case 'guia':
      return <Guia />
    case 'ajustes':
      return <Ajustes />
    case 'instalar':
      return <Instalar />
    case 'rutinas':
      return b === 'editar' ? <Editor key={c} id={c} /> : <Rutinas />
    case 'importar':
      return <Importar payload={b} />
    default:
      return <Semana />
  }
}
