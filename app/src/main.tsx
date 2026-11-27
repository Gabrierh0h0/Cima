import { render } from 'preact'
import { registerSW } from 'virtual:pwa-register'
import { App } from './app'
import { askPersist } from './lib/device'
import './styles.css'

render(<App />, document.getElementById('app')!)
registerSW({ immediate: true })
void askPersist()
