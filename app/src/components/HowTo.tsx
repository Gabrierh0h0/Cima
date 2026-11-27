import { useEffect, useRef, useState } from 'preact/hooks'
import type { Exercise } from '../data/routine'
import { Icon } from './Icon'

/** Hoja con el video y las pistas. El video no se descarga hasta que se toca. */
export function HowTo({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  const [play, setPlay] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => closeRef.current?.focus(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.search)}`

  return (
    <div class="sheet-wrap" onClick={onClose}>
      <section class="sheet" role="dialog" aria-modal="true" aria-label={`Cómo se hace: ${ex.name}`} onClick={(e) => e.stopPropagation()}>
        <header class="sheet-head">
          <h2 class="d">{ex.name}</h2>
          <button ref={closeRef} class="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon n="x" />
          </button>
        </header>

        {ex.youtubeId ? (
          <div class="video">
            {play ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ex.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                title={`Video: ${ex.name}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button class="video-facade" onClick={() => setPlay(true)} aria-label="Reproducir video">
                <img src={`https://i.ytimg.com/vi/${ex.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
                <span class="play">
                  <Icon n="play" s={28} />
                </span>
              </button>
            )}
          </div>
        ) : (
          <a class="video video-pending" href={search} target="_blank" rel="noopener noreferrer">
            <Icon n="video" s={28} />
            <span>Buscar un video de este ejercicio en YouTube</span>
          </a>
        )}

        <h3 class="d sub">Qué cuidar</h3>
        <ol class="cues">
          {ex.cues.map((c, i) => (
            <li key={i}>
              <span class="d num">{i + 1}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
        <p class="note mut">{ex.note}</p>
        {ex.youtubeId && (
          <a class="link" href={search} target="_blank" rel="noopener noreferrer">
            Ver otros videos
          </a>
        )}
      </section>
    </div>
  )
}
