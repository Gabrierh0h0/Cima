import { useState } from 'preact/hooks'
import { LEGAL, LEGAL_DOCS, legalDoc } from '../data/legal'
import { setMeta } from '../db'
import { Icon, Mark } from '../components/Icon'
import { Back } from '../components/Back'


/** Lista de documentos legales (#/legal) o uno en particular (#/legal/privacidad). */
export function Legal({ id }: { id?: string }) {
  const doc = id ? legalDoc(id) : undefined

  if (!doc) {
    return (
      <main class="screen nobar">
        <Back />
        <div class="top" style={{ marginTop: '8px' }}><h1 class="d" style={{ fontSize: '40px' }}>Legal</h1></div>
        <p class="mut" style={{ marginTop: '6px' }}>Versión del {LEGAL.fecha}.</p>
        <div class="group">
          {LEGAL_DOCS.map((d) => (
            <a class="row link-row" href={`#/legal/${d.id}`} key={d.id}>
              <span class="d" style={{ fontSize: '24px' }}>{d.title}</span>
              <span class="mut">{d.short}</span>
            </a>
          ))}
        </div>
        <div class="sign">
          <Mark s={16} c="var(--piedra)" />
          <span>Cima · Hecho por somospits.com.co</span>
        </div>
      </main>
    )
  }

  return (
    <main class="screen nobar legal">
      <Back />
      <h1 class="d" style={{ fontSize: '40px', marginTop: '12px' }}>{doc.title}</h1>
      <p class="mut" style={{ marginTop: '10px' }}>{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.h}>
          <h2 class="d">{s.h}</h2>
          {s.p.map((t, i) => <p key={i}>{t}</p>)}
        </section>
      ))}
    </main>
  )
}

/** Primera vez, o cuando cambian los textos: hay que aceptar para entrar. */
export function Aceptacion({ onDone }: { onDone: () => void }) {
  const [terms, setTerms] = useState(false)
  const [salud, setSalud] = useState(false)
  const ok = terms && salud

  return (
    <main class="screen nobar">
      <div class="top" style={{ justifyContent: 'flex-start', gap: '10px' }}>
        <Mark s={26} />
        <span class="d" style={{ fontSize: '28px' }}>Cima</span>
      </div>
      <h1 class="d" style={{ fontSize: '48px', marginTop: '28px' }}>Antes de empezar</h1>
      <p class="mut" style={{ marginTop: '10px' }}>
        Cima no tiene cuentas ni anuncios. Tu progreso se queda en este teléfono. Lee y acepta para entrar.
      </p>

      <div class="group">
        {LEGAL_DOCS.slice(0, 3).map((d) => (
          <a class="row link-row" href={`#/legal/${d.id}`} key={d.id}>
            <span class="d" style={{ fontSize: '22px' }}>{d.title}</span>
            <Icon n="chev" s={20} />
          </a>
        ))}
      </div>

      <label class="check">
        <input type="checkbox" checked={terms} onChange={(e) => setTerms((e.target as HTMLInputElement).checked)} />
        <span>Leí y acepto los Términos de uso y la Política de privacidad. Soy mayor de 18 años o uso Cima con permiso de mi acudiente.</span>
      </label>
      <label class="check">
        <input type="checkbox" checked={salud} onChange={(e) => setSalud((e.target as HTMLInputElement).checked)} />
        <span>Entiendo que Cima no es consejo médico y que entreno bajo mi propia responsabilidad.</span>
      </label>

      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <button
          class="btn"
          disabled={!ok}
          onClick={async () => {
            await setMeta('legalVersion', LEGAL.version)
            await setMeta('legalAcceptedAt', Date.now())
            onDone()
          }}
        >
          Aceptar y entrar
        </button>
      </div>
    </main>
  )
}
