// Capturas para la revisión final. Uso: node scripts/capture.mjs (con `npm run preview` en 4173)
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const OUT = new URL('../../.impeccable/review/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
mkdirSync(OUT, { recursive: true })
const URL0 = 'http://127.0.0.1:4173/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
const page = await browser.newPage()
const view = (w, h, mobile = true) => page.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
const shot = async (name) => { await sleep(500); await page.screenshot({ path: OUT + name }); console.log('ok', name) }
const click = (label) => page.evaluate((l) => { const b = [...document.querySelectorAll('button,a')].find((x) => x.getAttribute('aria-label') === l || x.textContent.trim() === l); b?.click(); return !!b }, label)

await view(390, 844)
await page.goto(URL0)
await page.evaluate(() => new Promise((res) => { indexedDB.deleteDatabase('cima').onsuccess = res }))
await page.goto(URL0)
await sleep(800)

// datos de ejemplo: 6 sesiones de hip thrust, subiendo
await page.evaluate(async () => {
  const db = await new Promise((res, rej) => { const r = indexedDB.open('cima'); r.onsuccess = () => res(r.result); r.onerror = rej })
  const day = 86400000, now = Date.now()
  const ws = [60, 62.5, 65, 67.5, 70, 75]
  await new Promise((res) => {
    const tx = db.transaction(['sessions', 'sets', 'meta'], 'readwrite')
    ws.forEach((w, i) => {
      const t = now - (ws.length - i) * 4 * day
      const rq = tx.objectStore('sessions').add({ dayId: 'dia-1', startedAt: t, finishedAt: t + 3000000 })
      rq.onsuccess = () => { for (let s = 1; s <= 4; s++) tx.objectStore('sets').add({ sessionId: rq.result, exerciseId: 'hip-thrust', setNo: s, weightKg: w, reps: i === 5 ? 10 : 8 + (s % 2), doneAt: t + s * 120000 }) }
    })
    tx.objectStore('meta').put({ key: 'installedAt', value: now - 30 * day }); tx.objectStore('meta').put({ key: 'legalVersion', value: '2026-11-27' })
    tx.oncomplete = res
  })
})
await page.goto(URL0 + '#/')
await page.reload()
await shot('mobile.png')

await view(320, 568)
await page.reload(); await shot('semana-320.png')

await view(1440, 900, false)
await page.reload(); await shot('desktop.png')

await view(390, 844)
await page.goto(URL0 + '#/sesion/dia-1'); await page.reload(); await sleep(700)
for (let i = 0; i < 4; i++) { await click('Subir peso'); }
await click('Serie hecha'); await sleep(600)
for (let i = 0; i < 5; i++) await click('Subir peso')
await shot('sesion.png')

await view(320, 568)
await page.reload(); await sleep(700); await shot('sesion-320.png')

await view(390, 844)
await page.goto(URL0 + '#/progreso'); await page.reload(); await shot('progreso.png')
await page.goto(URL0 + '#/guia'); await page.reload(); await shot('guia.png')
await page.goto(URL0 + '#/ajustes'); await page.reload(); await shot('ajustes.png')
await page.goto(URL0 + '#/instalar'); await page.reload(); await shot('instalar.png')

// completar el día para ver Fin
await page.goto(URL0 + '#/sesion/dia-1'); await page.reload(); await sleep(700)
for (let n = 0; n < 40 && !page.url().includes('#/fin'); n++) { await click('Serie hecha'); await sleep(200) }
await shot('fin.png')
await page.goto(URL0 + '#/sesion/dia-3'); await page.reload(); await sleep(700); await shot('sesion-maquina.png')

await browser.close()
