import { Icon } from '../components/Icon'

export function Instalar() {
  return (
    <main class="screen nobar">
      <div class="top">
        <a class="icon-btn" href="#/" aria-label="Volver"><Icon n="x" /></a>
      </div>
      <h1 class="d h1" style={{ marginTop: '12px' }}>Instala Cima</h1>
      <p class="mut" style={{ marginTop: '10px' }}>
        Así abre en pantalla completa y tu progreso no se borra. Hazlo desde Safari, no desde otro navegador.
      </p>
      <ol class="steps">
        <li>
          <span class="d n">1</span>
          <div><strong>Toca Compartir</strong><span class="t">El ícono del cuadro con una flecha hacia arriba <Icon n="share" s={18} />, abajo en Safari.</span></div>
        </li>
        <li>
          <span class="d n">2</span>
          <div><strong>Elige Agregar a pantalla de inicio</strong><span class="t">Desliza el menú hacia arriba si no lo ves. Busca el ícono del cuadro con un más <Icon n="plusbox" s={18} />.</span></div>
        </li>
        <li>
          <span class="d n">3</span>
          <div><strong>Toca Agregar</strong><span class="t">Desde ahora abre Cima desde el ícono en tu pantalla de inicio.</span></div>
        </li>
      </ol>
      <div class="spacer" />
      <a class="btn sec" href="#/">Ya la instalé</a>
    </main>
  )
}
