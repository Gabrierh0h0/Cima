// Capturas de la aceptación legal. Uso: node scripts/legal-shots.mjs [carpeta] (con `npm run preview` en 4173)
import puppeteer from 'puppeteer-core'

const OUT = (process.argv[2] ?? '.') + '/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
const p = await b.newPage() // perfil nuevo: sin datos previos
await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await p.goto('http://127.0.0.1:4173/')
await sleep(1000)
await p.screenshot({ path: OUT + 'gate.png' })
await p.goto('http://127.0.0.1:4173/#/legal/privacidad')
await sleep(600)
await p.screenshot({ path: OUT + 'doc.png' })
await p.goto('http://127.0.0.1:4173/#/')
await sleep(600)
for (const x of await p.$$('.check input')) await x.click()
await p.click('.btn')
await sleep(700)
await p.screenshot({ path: OUT + 'after.png' })
await b.close()
