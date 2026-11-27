import { useEffect, useState } from 'preact/hooks'
import { Semana } from './screens/Semana'
import { Sesion } from './screens/Sesion'
import { Fin } from './screens/Fin'
import { Progreso } from './screens/Progreso'
import { Guia } from './screens/Guia'
import { Ajustes } from './screens/Ajustes'
import { Instalar } from './screens/Instalar'

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
  const [, a, b] = h.replace('#', '').split('/')
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
    default:
      return <Semana />
  }
}
