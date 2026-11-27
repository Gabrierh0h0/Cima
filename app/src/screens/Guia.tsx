import { TabBar } from './Semana'
import { Icon } from '../components/Icon'

const GLOSSARY: [string, string][] = [
  ['Hip thrust', 'Empuje de cadera. Espalda apoyada en un banco, subes la cadera con una barra encima para trabajar el glúteo.'],
  ['Peso muerto rumano', 'Bajas la barra por delante de las piernas llevando la cadera hacia atrás, con las rodillas casi estiradas. Trabaja glúteo y parte trasera del muslo.'],
  ['Curl femoral', 'Doblas las rodillas contra una resistencia para trabajar la parte trasera del muslo.'],
  ['Prensa', 'Máquina donde empujas una plataforma con los pies, sentada o recostada.'],
  ['Pendulum / hack', 'Sentadillas en máquina con respaldo. Cuidan la espalda y trabajan el frente del muslo.'],
  ['Peck deck', 'Máquina de aperturas: juntas los brazos al frente para trabajar el pecho.'],
  ['Pull-over', 'Llevas el peso desde arriba hacia abajo con los brazos casi estirados, para sentir la espalda.'],
  ['Polea', 'Cable con peso que sale de una torre. Se cambia de agarre con cuerda, barra o manija.'],
  ['Smith', 'Barra guiada por rieles. Es más estable que la barra libre.'],
  ['Step-up', 'Subir a un cajón con una pierna y bajar con control.'],
  ['Unilateral', 'Un lado a la vez, por ejemplo un brazo o una pierna.'],
]

export function Guia() {
  return (
    <main class="screen guide">
      <div class="top"><h1 class="d" style={{ fontSize: '40px' }}>Guía</h1></div>
      <p class="mut" style={{ marginTop: '6px' }}>Lo básico para entrenar con claridad.</p>

      <div class="group">
        <details open>
          <summary>Cómo usar Cima<Icon n="down" /></summary>
          <div class="body">
            <p>Cada día tiene su lista de ejercicios. Toca Empezar y la app te muestra una serie a la vez.</p>
            <p>Ajusta el peso y las repeticiones que hiciste y toca Serie hecha. Después empieza el descanso. Si no entiendes un ejercicio, toca Ver cómo se hace.</p>
          </div>
        </details>

        <details>
          <summary>Series, repeticiones y descanso<Icon n="down" /></summary>
          <div class="body">
            <dl>
              <div><dt>Repetición</dt><dd>Una vez completa del movimiento: bajar y subir.</dd></div>
              <div><dt>Serie</dt><dd>Un grupo de repeticiones seguidas. “3 × 10” son tres series de diez repeticiones.</dd></div>
              <div><dt>Descanso</dt><dd>De 90 a 120 segundos en ejercicios sencillos y de 150 a 180 en los pesados. El temporizador lo cuenta por ti.</dd></div>
            </dl>
          </div>
        </details>

        <details>
          <summary>Qué es el RIR<Icon n="down" /></summary>
          <div class="body">
            <p>RIR son las repeticiones que te quedan en el tanque al terminar una serie. Sirve para saber si el peso es el correcto.</p>
            <div class="rir">
              <b>0</b><span>No podías hacer ni una más.</span>
              <b>1</b><span>Podías hacer una más con esfuerzo.</span>
              <b>2</b><span>Podías hacer dos más. Es un buen punto para la mayoría de series.</span>
              <b>3+</b><span>Estaba muy ligero. Sube el peso.</span>
            </div>
          </div>
        </details>

        <details>
          <summary>Cuándo subir el peso<Icon n="down" /></summary>
          <div class="body">
            <p>Cuando completas todas las series en el tope de repeticiones con buena técnica, sube un poco el peso. Cima te avisa con una sugerencia al empezar el ejercicio.</p>
            <p>Al subir, es normal hacer menos repeticiones. Trabaja de nuevo hasta llegar al tope.</p>
          </div>
        </details>

        <details>
          <summary>Los discos de la barra<Icon n="down" /></summary>
          <div class="body">
            <p>En ejercicios con barra, el dibujo muestra qué discos poner en cada lado. La barra sola pesa 20 kg. Los colores son los de competencia.</p>
            <div class="rir">
              <b>25</b><span>Rojo</span><b>20</b><span>Azul</span><b>15</b><span>Amarillo</span><b>10</b><span>Verde</span>
              <b>5</b><span>Blanco</span><b>2,5</b><span>Negro</span><b>1,25</b><span>Cromo</span>
            </div>
          </div>
        </details>

        <details>
          <summary>Glosario<Icon n="down" /></summary>
          <div class="body">
            <dl>
              {GLOSSARY.map(([t, d]) => (
                <div key={t}><dt>{t}</dt><dd>{d}</dd></div>
              ))}
            </dl>
          </div>
        </details>
      </div>
      <TabBar active="guia" />
    </main>
  )
}
