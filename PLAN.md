# Plan inicial: app de rutina y seguimiento (v1)

Producida por somospits.com.co. Estado: borrador para aprobar antes de construir.

## 1. Qué es

Una PWA en español para una clienta con iPhone que sabe poco de entrenamiento. Tiene la rutina de 5 días, muestra cómo se ejecuta cada ejercicio y le deja registrar peso y repeticiones por serie para ver su progreso. Todos los datos viven en su celular.

Fuente de la rutina: `Downloads/plan_de_entrenamiento_semanal_5_d_as.md` (5 días, 29 entradas de ejercicio y 28 distintos, porque la extensión de cuádriceps se repite, con series, reps y notas técnicas).

## 2. Decisiones ya tomadas

| Tema | Decisión |
|---|---|
| Plataforma | PWA instalable. En iOS se instala desde Safari con Compartir, "Agregar a pantalla de inicio" |
| Datos | Solo en el dispositivo (IndexedDB), con respaldo y exportar a archivo |
| Video | YouTube embebido en v1, un video verificado por ejercicio. Clips propios en v2 |
| Registro | Peso + reps por serie, precargado con la sesión anterior |
| Ayudas | Temporizador de descanso, aviso de subir peso, guía de RIR y glosario, gráficas y récords |
| Identidad | Crear una nueva con `logo-design`, con crédito discreto "Hecho por somospits.com.co" |
| Tono | Oscuro, sobrio, de gym, con un toque femenino sobrio |
| Publicación | Hosting estático gratuito. Los cambios de rutina se hacen editando un archivo de datos |

## 3. Riesgos de iOS que condicionan el diseño

1. **No hay botón de instalar.** El onboarding trae una guía de 3 pasos con capturas, visible solo si la app no corre en modo `standalone`.
2. **Los datos pueden borrarse** si la usa solo desde una pestaña de Safari. Se mitiga pidiendo la instalación y con un botón de respaldo. La app recuerda cada 2 semanas hacer un respaldo.
3. **El temporizador no corre con la pantalla bloqueada.** Se calcula con la hora de fin, no con un contador, y se recalcula al volver a abrir la app. Se usa Wake Lock para mantener la pantalla encendida durante la sesión. iOS no permite vibración desde la web, así que el aviso es visual y un sonido corto que se activa con el primer toque.
4. **Los videos necesitan internet.** El resto de la app funciona sin conexión. Si no hay señal, el video muestra el texto de técnica y la ficha del ejercicio.

## 4. Pantallas

1. **Instalar**: guía iOS, solo la primera vez.
2. **Semana**: los 5 días como lista, con el de hoy resaltado y el estado de cada uno (pendiente, en curso, hecho). Un solo botón grande para "Empezar el día de hoy".
3. **Día**: grupo muscular, objetivo en una línea y lista de ejercicios con series x reps.
4. **Ejercicio en sesión** (la pantalla que más se usa):
   - video de YouTube con carga al tocar (sin descargar nada hasta que lo pida)
   - 3 pistas de técnica sacadas de las notas del plan
   - filas de series con peso y reps, con los valores de la vez anterior precargados
   - temporizador de descanso que arranca al marcar la serie
   - aviso de subir peso cuando cumple el tope de reps en todas las series
5. **Progreso**: por ejercicio, curva de peso, mejor marca y volumen. Un resumen semanal simple.
6. **Guía**: qué es RIR, series, reps, descanso, progresión y glosario (RDL, Hip Thrust, Pendulum, Peck Deck, etc.) en lenguaje llano.
7. **Ajustes**: exportar y restaurar respaldo, unidad (kg), borrar datos.

## 5. Modelo de datos

```
routine.json   (editable por ti, versionado)
  days[]: { id, name, focus, summary, exercises[] }
  exercises[]: { id, name, sets, repsMin, repsMax, perSide, restSec,
                 cues[], youtubeId, equipmentNote }

IndexedDB (en el celular)
  sessions: { id, dayId, date, durationSec }
  sets:     { sessionId, exerciseId, setNo, weightKg, reps, done }
  meta:     { lastBackupAt, installedAt, routineVersion }
```

Reglas:
- Aviso de subir peso: todas las series al `repsMax` con peso igual, y se sugiere subir entre 2.5% y 5%, redondeado a 0.5 kg.
- Descanso: `restSec` por ejercicio, con 150 a 180 s para los multiarticulares pesados y 90 a 120 s para accesorios, según la guía del plan.
- Un cambio de rutina sube `routineVersion` sin borrar el historial. Los ejercicios se enlazan por `id`.

## 6. Dirección visual (para `/unslop`, `/impeccable` y `/ui-ux-pro-max`)

- **Producto:** rutina guiada y seguimiento para una persona que entrena sin entrenador al lado.
- **Carácter:** firme, calmado, exacto. Nada de motivación a gritos.
- **Mundo:** el gimnasio de noche. Acero cepillado, magnesio, cinta de medidas, iluminación cenital.
- **Momentos ricos:** (1) la pantalla de ejercicio, con el video como único elemento con color y detalle; (2) la gráfica de progreso, hecha con cuidado y con un acento único.
- **Firma:** un indicador de series estilo "pesas en la barra" (discos que se llenan al completar cada serie), usado solo en la sesión.
- **Color:** neutros grafito sin tinte fuerte, un acento cálido apagado (terracota o rosa polvo, a decidir en la identidad) para la acción principal y la serie completa.
- **Tipografía:** una familia condensada para títulos y cifras (aspecto de marcador de gym) y una sans legible para el cuerpo. Cifras tabulares siempre.
- **Evitar:** degradados morados, glow, emojis, etiquetas en mayúsculas con tracking, tarjetas iguales en fila, confeti.
- **Táctil:** objetivos de 44 px o más, campos numéricos con teclado `inputmode="decimal"`, zona del pulgar para la acción principal, `safe-area` para el notch y la barra inferior.
- **Movimiento:** solo funcional (entrada de serie, avance del temporizador). Respeta `prefers-reduced-motion`.

## 7. Stack propuesto

- Vite + TypeScript + Preact (ligero) o React, a decidir en la construcción.
- `vite-plugin-pwa` (manifest, service worker, caché de la app).
- IndexedDB con Dexie.
- Gráficas en SVG propio, sin librería pesada.
- YouTube con `youtube-nocookie.com` y carga diferida al tocar.
- Hosting: Cloudflare Pages (o similar), subdominio de somospits.com.co.

## 8. Fases

1. **Identidad:** nombre de la app, logo, paleta, tipografías (`logo-design`). Se aprueba antes de pantallas.
2. **Contenido:** pasar la rutina a `routine.json`, buscar y verificar el video de YouTube de cada ejercicio, y redactar las 3 pistas de técnica y el glosario en lenguaje llano.
3. **Sistema de diseño:** tokens, componentes y `design-system/MASTER.md`.
4. **Construcción:** semana, día, sesión, registro, temporizador y progreso.
5. **PWA e iOS:** instalación, modo offline, Wake Lock y prueba real en un iPhone.
6. **Revisión:** pasada con `/unslop` y `/impeccable` (critique y polish), accesibilidad y rendimiento.
7. **Entrega:** publicar, probar con la clienta e instruirla a instalar.

## 9. Pendiente por definir

- Nombre de la clienta y de la app (afecta la identidad y el saludo).
- Dominio o subdominio exacto.
- Si la identidad debe ser de la clienta o de Pits (en el segundo caso, la app va sin su nombre).
- Si el acento se prefiere terracota o rosa apagado (se propondrá con muestras).
- Probar en un iPhone real: ¿tienes uno a mano o la clienta hará la prueba?
- Videos: confirmar si prefieres canal o autor concreto, o dejo que elija los mejor valorados en español.

## 10. Fuera de alcance en v1

Cuentas y login, sincronización entre dispositivos, panel del entrenador, clips propios, notificaciones push, modo claro.

## Actualización: decisiones de identidad y diseño

- **Nombre y marca:** Cima, aprobada. Archivos en `identidad/` (guía, paleta, iconos de PWA).
- **Dirección de pantallas:** opción C, Foco: una serie a la vez, con la barra de discos de colores de competencia como único color fuerte. Muestras en `pantallas/opcion-c.html` y `.png`; las opciones A y B quedan como referencia.
- **Contrato de dirección:** `.impeccable/surfaces/app-index-html.md`. `PRODUCT.md` recoge la verdad del producto.
- **Tipografía:** Barlow Condensed (títulos y cifras) y Barlow (texto), autoalojadas en `pantallas/fonts/`.
- **Pendiente:** pantallas Guía, Ajustes, fin de sesión y estado vacío; buscar y verificar los 28 videos de YouTube; escribir `routine.json`; construir la PWA; `DESIGN.md` al terminar.
