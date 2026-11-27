const P = {
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chart: '<path d="M4 19V5M4 19h16M8 15l4-5 3 3 5-7"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  up: '<path d="M12 19V6M6 12l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4M6 12v7h12v-7"/>',
  download: '<path d="M12 4v11M8 11l4 4 4-4M5 19h14"/>',
  upload: '<path d="M12 15V4M8 8l4-4 4 4M5 19h14"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  home: '<path d="M4 11l8-6 8 6v9H4z"/>',
  plusbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
} as const

export type IconName = keyof typeof P

export function Icon({ n, s = 24, sw = 1.75 }: { n: IconName; s?: number; sw?: number }) {
  return (
    <svg
      class="ic"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={sw}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: P[n] }}
    />
  )
}

export function Mark({ s = 22, c = 'var(--terra)' }: { s?: number; c?: string }) {
  return (
    <svg viewBox="40 36 176 180" width={s} height={s} aria-hidden="true">
      <path fill={c} d="M40 216L144 36V96H180V156H216V216Z" />
    </svg>
  )
}
