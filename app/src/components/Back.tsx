import { Icon } from './Icon'

export const goBack = (fallback = '#/') => (history.length > 1 ? history.back() : (location.hash = fallback))

export const Back = ({ label = 'Volver', fallback = '#/' }: { label?: string; fallback?: string }) => (
  <button class="link back" onClick={() => goBack(fallback)}>
    <span class="flip"><Icon n="chev" s={20} /></span>
    {label}
  </button>
)
