---
name: Cima
description: App de rutina guiada para iPhone, oscura, una serie a la vez, con la barra de discos de competencia como único color rico.
colors:
  grafito-950: "#141312"
  grafito-900: "#1B1A19"
  grafito-800: "#252321"
  grafito-700: "#34312E"
  hueso: "#F2EEE8"
  piedra: "#A39C93"
  terracota: "#C8633F"
  exito: "#61DA92"
  error: "#F66D67"
  linea: "rgba(242,238,232,.09)"
  disco-25: "#B4382E"
  disco-20: "#2D5C9B"
  disco-15: "#C7A126"
  disco-10: "#3F7B50"
  disco-5: "#E3DED5"
  disco-2-5: "#4A4642"
  disco-1-25: "#A8A39B"
  barra-acero: "#6F6A63"
  barra-collar: "#57524C"
  barra-zona-agarre: "#8E8981"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "96px"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "0.005em"
  cifra-peso:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "84px"
    fontWeight: 600
    lineHeight: 0.9
  cifra-reps:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "52px"
    fontWeight: 600
    lineHeight: 0.9
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "46px"
    fontWeight: 600
    lineHeight: 0.98
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
  boton:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.4
  body-strong:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  xs: "2px"
  sm: "6px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  sheet: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.grafito-950}"
    typography: "{typography.boton}"
    rounded: "{rounded.lg}"
    height: "64px"
  button-secondary:
    backgroundColor: "{colors.grafito-800}"
    textColor: "{colors.hueso}"
    typography: "{typography.boton}"
    rounded: "{rounded.lg}"
    height: "64px"
  button-small:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.grafito-950}"
    rounded: "{rounded.lg}"
    height: "52px"
  step-button:
    backgroundColor: "{colors.grafito-800}"
    textColor: "{colors.hueso}"
    rounded: "{rounded.xl}"
    size: "64px"
  day-chip:
    backgroundColor: "{colors.grafito-900}"
    textColor: "{colors.piedra}"
    rounded: "{rounded.md}"
    height: "56px"
  day-chip-selected:
    backgroundColor: "{colors.hueso}"
    textColor: "{colors.grafito-900}"
    rounded: "{rounded.md}"
    height: "56px"
  rest-chip:
    backgroundColor: "{colors.grafito-800}"
    textColor: "{colors.hueso}"
    rounded: "20px"
    height: "44px"
  note-card:
    backgroundColor: "{colors.grafito-900}"
    textColor: "{colors.hueso}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  sheet:
    backgroundColor: "{colors.grafito-900}"
    textColor: "{colors.hueso}"
    rounded: "{rounded.sheet}"
    padding: "16px 20px 24px"
  tab-bar:
    backgroundColor: "{colors.grafito-900}"
    textColor: "{colors.piedra}"
    padding: "8px"
---

# Design System: Cima

## Overview

**Creative North Star: "El gimnasio de noche"**

Cima es una app oscura para entrenar de pie, con una mano y poca luz. La dirección se llama Foco: una sola cosa por pantalla, una serie a la vez. Todo es grafito cálido, texto hueso y cifras condensadas enormes. El color rico existe en un solo lugar: la barra horizontal que se carga con discos de competencia en tonos mates según el peso. Terracota es la voz de la acción (el botón principal y la serie que se sigue en la gráfica), nada más.

La estructura se reconoce sin contenido: tipografía condensada grande, filas separadas por líneas finas (sin tarjetas iguales apiladas), una columna de 480 px y la barra con discos. La profundidad es tonal, sin sombras. El tono visual es sobrio y de herramienta; las pantallas de enseñanza (Guía, Instalar) usan las mismas filas y líneas, no ilustración.

Procedencia de los materiales. La paleta de discos son los colores de competencia IWF (25 rojo, 20 azul, 15 amarillo, 10 verde, 5 blanco, 2.5 negro, 1.25 cromo) en versiones mates. Barlow y Barlow Condensed están autoalojadas en `app/public/fonts` (Barlow 400/500, Barlow Condensed 500/600, woff2), sin CDN. Los iconos son SVG de línea escritos a mano (viewBox 24, trazo 1.75, extremos y uniones redondos, `currentColor`) en `src/components/Icon.tsx`. No hay rasters salvo los iconos de marca exportados desde `identidad/export` (`app/public/icons`: favicon, apple-touch-icon, 192, 512, maskable).

**Key Characteristics:**
- Una serie a la vez; sin tarjetas iguales en cuadrícula.
- Cifras tabulares, condensadas, de 52 a 96 px donde importa el dato.
- Terracota solo para acción principal y la serie actual; discos como único color rico.
- Plano: capas de grafito y líneas de 1 px, sin sombras.
- Objetivos táctiles de 48 a 64 px.

## Colors

Grafito cálido en cuatro escalones, hueso y piedra para texto, un acento terracota y los discos mates.

### Primary
- **Terracota** (#C8633F): fondo del botón principal ("Empezar", "Serie hecha"), segmento y punto de la serie actual, icono activo de la barra de pestañas, numerales de los pasos de Instalar, línea y punto de la gráfica.

### Neutral
- **Grafito 950** (#141312): fondo de la app, texto sobre terracota, relleno de los puntos de la gráfica.
- **Grafito 900** (#1B1A19): barra de pestañas, hoja inferior, tarjeta de nota, chips de día.
- **Grafito 800** (#252321): botón secundario, botones − y +, chip de descanso, número de pista.
- **Grafito 700** (#34312E): segmentos y puntos pendientes.
- **Hueso** (#F2EEE8): texto principal, día seleccionado, segmentos hechos, foco.
- **Piedra** (#A39C93): texto secundario, etiquetas, ejes de la gráfica.
- **Línea** (rgba(242,238,232,.09)): divisores y bordes de 1 px.

### Semánticos
- **Éxito** (#61DA92): serie hecha, mensajes correctos, descanso listo.
- **Error** (#F66D67): errores y acción destructiva.

### Discos (solo en la barra)
- 25 kg **Rojo mate** (#B4382E), 20 kg **Azul mate** (#2D5C9B), 15 kg **Amarillo mate** (#C7A126), 10 kg **Verde mate** (#3F7B50), 5 kg **Blanco hueso** (#E3DED5), 2.5 kg **Negro grafito** (#4A4642, con borde #6F6A63), 1.25 kg **Cromo** (#A8A39B). La barra es acero (#6F6A63), agarre (#8E8981) y collares (#57524C).

### Named Rules
**The Plate Rule.** El color rico pertenece a los discos. Ninguna otra superficie usa rojo, azul, amarillo o verde decorativo; éxito y error son semánticos y se usan como texto, icono o borde.
**The One Voice Rule.** Terracota marca la acción principal y lo que se sigue en el tiempo. Una pantalla tiene un solo botón terracota.

## Typography

**Display Font:** Barlow Condensed 600 (sans-serif de respaldo)
**Body Font:** Barlow 400/500 (system-ui de respaldo)

**Character:** condensada y pesada para lo que se lee de lejos y de un vistazo; humanista neutra para frases. Todo con cifras tabulares para que los números no bailen al ajustar.

### Hierarchy
- **Display** (600, 96 px, 0.9): "Día 1" en Semana. 72 px si la altura es menor a 700 px.
- **Cifra de peso** (600, 84 px, 0.9): peso en Sesión; 68 px en altura baja. **Cifra de reps** 52 px.
- **Headline** (600, 46 px, 0.98): nombre del ejercicio (38 px en altura baja); 56 px para el título de Fin.
- **Title** (600, 28 a 34 px, 1): nombre del día, secciones, tarjetas de Progreso, hoja (32 px), filas de datos (28 px).
- **Botón** (600, 24 px, +0.02em; 20 px en el pequeño).
- **Body** (400, 17 px, 1.4) y **body-strong** (500) para nombres en listas.
- **Label** (400, 15 px; 12 a 14 px para metadatos y pestañas a 13 px 500) en Piedra.

### Named Rules
**The Big Number Rule.** El dato que se actúa (peso, reps, día) va en Barlow Condensed a 52 px o más; el texto de apoyo nunca compite con él.
**The Tabular Rule.** Cifras tabulares en todo el documento (`font-variant-numeric: tabular-nums` en body).

## Layout

Columna única centrada de 480 px máximo sobre fondo grafito 950; en escritorio es la misma columna. Pantallas con relleno lateral de 20 px, superior de 16 px más el área segura, e inferior de 104 px para la barra de pestañas (24 px en pantallas sin barra, como la sesión). El ritmo vertical se apoya en 4/8/12/16/20/28 px. Las listas son filas de 52 px mínimo separadas por líneas de 1 px, no tarjetas. El botón principal vive pegado abajo (sticky sobre la barra en Semana, pie de pantalla en Sesión). Un único salto responsivo: con altura menor a 700 px se reducen el display, el peso y el nombre del ejercicio. Progreso usa tarjetas de ancho completo con desplazamiento horizontal por snap. Se respeta `prefers-reduced-motion` (se anulan transiciones y animaciones).

## Elevation & Depth

Sin sombras en todo el sistema. La profundidad es tonal: grafito 950 de fondo, 900 para superficies que se sientan encima (pestañas, hoja, nota), 800 para controles. La hoja inferior se separa con un velo rgba(10,9,9,.72) y un borde superior de línea. Los divisores de 1 px hacen la jerarquía que otros sistemas hacen con tarjetas.

### Named Rules
**The Flat Rule.** Ninguna sombra. Una capa nueva sube un escalón de grafito o gana un borde de línea.

## Shapes

Esquinas suaves y consistentes: 12 px en chips, notas y miniaturas; 14 px en botones; 16 px en los botones − y +; 20 px arriba de la hoja y en el chip de descanso; 2 a 3 px en discos y segmentos de progreso. Los bordes son de 1 px de línea; el foco es un contorno hueso de 2 px con 3 px de separación. Pistas numeradas en círculos de 28 px. Los segmentos de progreso son barras de 4 px (día) y 6 px (series).

## Components

### Buttons
- **Shape:** 14 px de radio, ancho completo, 64 px de alto (52 px en pequeño).
- **Primary:** fondo terracota, texto grafito 950, Barlow Condensed 600 24 px; `:active` baja el brillo al 92%.
- **Secondary:** grafito 800, texto hueso, borde de línea. **Danger:** secundario con texto de error.
- **Disabled:** opacidad .45. **Step (− y +):** 64 px cuadrados, 16 px de radio, grafito 800; `:active` sube a grafito 700.
- **Link:** hueso 500 subrayado en Piedra, 48 px de alto mínimo.

### Navigation
Barra de pestañas fija abajo, grafito 900 con borde superior de línea; icono y etiqueta (Barlow 500 13 px) en Piedra, hueso con icono terracota para la pestaña activa (`aria-current`). Objetivos de 48 px.

### Chips
Tira de cinco días: celdas de 56 px, grafito 900, borde de línea; la seleccionada pasa a fondo hueso con texto grafito (`aria-pressed`). El día hecho lleva icono de éxito. El chip de descanso es una píldora de 44 px con icono terracota y borde de éxito cuando está listo.

### Lists
Filas de 52 px con índice en Piedra, nombre en 500, serie a la derecha, separadas por líneas. Se repite en Semana, Fin (recs), Ajustes (rows) y Guía (details con summary de 24 px condensada y chevron que gira 180°).

### Barra con discos (componente firma)
SVG de 342 × 124 a ancho completo que dibuja la barra de 20 kg y los discos por lado (`src/lib/plates.ts`), mayor a menor, desde el centro hacia afuera, con collares. Los discos de 25 a 10 kg miden 112 de alto y llevan su peso girado en Barlow Condensed 600 13 px. Tiene `role="img"` con etiqueta que describe los discos. Es el único lugar con color rico.

### Hoja inferior
Grafito 900, 20 px arriba, máx. 92 dvh; velo oscuro. Contiene título de 32 px, video con fachada 16:9 (borde punteado en estado pendiente), pistas numeradas y notas.

### Gráfica
SVG propio: línea terracota de 2.5 px, puntos rellenos en grafito 950 con borde terracota y el último relleno, ejes en Piedra 12 px.

## Do's and Don'ts

### Do:
- **Do** mantener una sola acción principal terracota por pantalla, de 64 px de alto.
- **Do** poner el dato accionable en Barlow Condensed de 52 px o más, con cifras tabulares.
- **Do** separar con líneas de 1 px (`--linea`) en lugar de envolver filas en tarjetas.
- **Do** dibujar iconos nuevos como línea de 1.75 en viewBox 24 con `currentColor`.
- **Do** crear profundidad subiendo un escalón de grafito.
- **Do** usar objetivos de al menos 44 a 48 px y pasar por `Icon` para todo glifo.

### Don't:
- **Don't** usar emoji ni iconos de fuente.
- **Don't** añadir sombras, degradados ni color decorativo fuera de los discos.
- **Don't** apilar tarjetas iguales de ejercicios; la dirección rechaza la tabla de tarjetas.
- **Don't** usar fuentes del sistema para títulos ni cargar tipografías desde un CDN.
- **Don't** añadir rasters nuevos; solo los iconos de marca de `identidad/export`.

No canonizado: ver el sidecar para los desvíos (`.guide .body p` usa #d8d3cb y la barra y la gráfica llevan hex fijos en SVG, fuera de `:root`).
