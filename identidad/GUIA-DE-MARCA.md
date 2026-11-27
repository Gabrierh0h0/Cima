# Cima: guía de marca (v1)

Producto de somospits.com.co. Esta marca es independiente del logo de Pits. Pits aparece solo como firma discreta.

## Idea

Un pico que se alcanza subiendo tres peldaños iguales: la progresión de carga. El logotipo repite la diagonal de 60° en la M y la A, y los cortes en 45° de la C.

## Archivos

| Uso | Archivo |
|---|---|
| Símbolo a color | `final/cima-symbol.svg` |
| Logo horizontal (fondo claro / oscuro) | `final/cima-horizontal.svg` / `final/cima-horizontal-dark.svg` |
| Logo apilado (fondo claro / oscuro) | `final/cima-stacked.svg` / `final/cima-stacked-dark.svg` |
| Solo logotipo | `final/cima-wordmark.svg` |
| Un color negro y blanco | `export/horizontal/`, `export/stacked/`, `export/symbol/` |
| Icono de app, favicon y PWA | `export/symbol/` (incluye `site.webmanifest` y `head-snippet.html`) |
| Presentación con maquetas | `presentacion.html` y `presentacion-slides/` |

Los logotipos están construidos como trazos, sin fuentes. No dependen de ninguna tipografía instalada.

## Color

| Nombre | Hex | Uso |
|---|---|---|
| Terracota | `#C8633F` | Símbolo y acción principal. 4.69:1 sobre grafito (texto permitido). 3.42:1 sobre hueso (solo gráficos grandes) |
| Terracota profundo | `#A5472B` | Texto o ícono de acento sobre fondo claro. 5.14:1 sobre hueso |
| Grafito 950 | `#141312` | Fondo de la app |
| Grafito 900 | `#1B1A19` | Logotipo sobre fondo claro y superficies |
| Hueso | `#F2EEE8` | Texto sobre oscuro y fondo claro. 16:1 sobre grafito |
| Piedra | `#6B645C` | Texto secundario sobre claro. 5.04:1 sobre hueso |

Reglas: el terracota nunca cubre superficies grandes. Se usa para el símbolo, el botón principal y el dato que importa. El resto son neutros.

## Combinaciones permitidas

1. Símbolo terracota y logotipo grafito sobre hueso.
2. Símbolo terracota y logotipo hueso sobre grafito.
3. Todo en negro o todo en blanco (un solo color), para sellos, bordado y fotocopias.
4. Todo en terracota sobre grafito, para estampados.

## Zona de seguridad y tamaños mínimos

- Espacio libre alrededor: una altura de peldaño (un tercio de la altura del símbolo), en todos los lados.
- Símbolo solo: mínimo 16 px en pantalla o 5 mm en impreso.
- Logo horizontal: mínimo 96 px de ancho o 25 mm.
- Logo apilado: mínimo 72 px de ancho o 20 mm.
- Por debajo de esos tamaños, usar solo el símbolo.

## No hacer

- Estirar, inclinar o girar el logo.
- Cambiar los colores fuera de las combinaciones de arriba.
- Añadir sombras, brillos, degradados o contornos.
- Reescribir el nombre con otra tipografía.
- Cambiar el orden o la altura de los peldaños.
- Poner el logo sobre fotos sin contraste suficiente.
- Usar el terracota sobre rojos, naranjas o marrones cercanos.

## Firma de Pits

Texto pequeño "Hecho por somospits.com.co" en el pie de la app y en la pantalla de ajustes, en gris piedra. Sin logo de Pits.

## Pendiente

- El logotipo está construido a mano: una letra por vez, con construcción geométrica de 120 de alto y trazo de 24. Conviene revisarlo con un tipógrafo antes de usarlo en impresos grandes.
- No se ha hecho búsqueda de marca registrada. Recomendada antes de comercializar bajo el nombre "Cima", que es una palabra común.
- Los textos de los títulos del tablero de presentación salen en inglés porque el script no los traduce.

## Paleta ampliada para la app

Los tokens están en `paleta.css` y una vista de ejemplo en `paleta-app.png`. La app es oscura, así que estos colores están pensados para fondo grafito.

| Uso | Color | Hex |
|---|---|---|
| Acción principal y gráfica principal | Terracota | `#C8633F` |
| Día 1 · Cadena posterior | Malva | `#D293C4` |
| Día 2 · Push | Pizarra | `#82A5E4` |
| Día 3 · Cadena anterior | Ocre | `#D7B355` |
| Día 4 · Pull | Petróleo | `#5DBBC6` |
| Día 5 · Full leg | Oliva | `#A2BC75` |
| Éxito | Verde | `#61DA92` |
| Aviso | Ocre | `#D7B355` |
| Error | Coral | `#F66D67` |

Reglas:
- Los colores de día solo van como barra de 4 px, punto o icono junto al nombre del día, y en la barra de volumen semanal. Nunca como fondo de tarjeta o de pantalla.
- El terracota es solo para la acción principal de la pantalla y la serie que se sigue en una gráfica. Los colores de día no compiten con él.
- Éxito, aviso y error llevan siempre icono y texto, no solo color. Oliva se parece al verde de éxito y ocre al aviso, por eso los días nunca usan icono de estado.
- Todos superan 6:1 de contraste sobre grafito. No sirven sobre fondo claro; el modo claro queda fuera de la v1.
