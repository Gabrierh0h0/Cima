export const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

export const isIOS = (): boolean => /iphone|ipad|ipod/i.test(navigator.userAgent)

let wake: WakeLockSentinel | null = null
export async function keepAwake(on: boolean): Promise<void> {
  try {
    if (on && 'wakeLock' in navigator && !wake) {
      wake = await navigator.wakeLock.request('screen')
      wake.addEventListener('release', () => (wake = null))
    } else if (!on && wake) {
      await wake.release()
      wake = null
    }
  } catch {
    /* sin soporte o sin permiso */
  }
}
// El bloqueo se pierde al ocultar la app; se vuelve a pedir al regresar.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && keepAwakeWanted) void keepAwake(true)
})
let keepAwakeWanted = false
export const holdScreen = (on: boolean) => {
  keepAwakeWanted = on
  void keepAwake(on)
}

let ctx: AudioContext | null = null
/** Llamar desde un toque del usuario para que iOS permita el sonido después. */
export function unlockAudio(): void {
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    /* sin audio */
  }
}
export function beep(): void {
  if (!ctx) return
  const t = ctx.currentTime
  for (const [i, f] of [660, 880].entries()) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = f
    g.gain.setValueAtTime(0.0001, t + i * 0.18)
    g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.18 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.16)
    o.connect(g).connect(ctx.destination)
    o.start(t + i * 0.18)
    o.stop(t + i * 0.18 + 0.18)
  }
}

export async function askPersist(): Promise<void> {
  try {
    await navigator.storage?.persist?.()
  } catch {
    /* ignorar */
  }
}
