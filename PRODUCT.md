# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

PWA instalable en iPhone (Safari, "Agregar a pantalla de inicio"): Vite + TypeScript + Preact, `vite-plugin-pwa`, IndexedDB (Dexie), gráficas en SVG propio. Hosting estático gratuito. Decidido en PLAN.md y aprobado por el usuario.

## Users

Una clienta con iPhone que entrena sin entrenador al lado y sabe poco de entrenamiento y de ejecución de los ejercicios. Usa la app de pie en el gimnasio, entre series, con una mano, a veces con luz baja o con las manos sudadas. Quien encarga la app es somospits.com.co, que la produce para esa clienta y quiere poder reutilizarla con otros clientes.

## Product Purpose

Dar la rutina semanal de 5 días separada por día, mostrar cómo se ejecuta cada ejercicio (video de YouTube en v1) y permitir registrar peso y repeticiones por serie para seguir el progreso. Éxito: la clienta registra cada sesión sin esfuerzo, entiende qué hacer y ve que sube de carga con el tiempo.

## Positioning

Una app de rutina guiada hecha a la medida de un plan concreto, sin cuentas ni suscripción, que enseña a quien no sabe: cómo cargar la barra, qué es RIR, cuándo subir peso.

## Operating Context

- Se usa en el celular, dentro del gimnasio, entre series con descansos de 90 s a 3 min.
- Los datos viven solo en el dispositivo (IndexedDB) con respaldo y exportar a archivo.
- iOS no pausa bien los temporizadores con pantalla bloqueada: el descanso se calcula con hora de fin y se mantiene la pantalla encendida.
- Los videos de YouTube necesitan internet; el resto funciona sin conexión.
- Idioma: español de Colombia.

## Capabilities and Constraints

- Rutina de 5 días y 28 ejercicios distintos (29 entradas), con series, repeticiones, notas técnicas y progresión (fuente: `plan_de_entrenamiento_semanal_5_d_as.md`).
- Registro de peso y repeticiones por serie, precargado con la sesión anterior.
- Temporizador de descanso, aviso de subir peso al completar el tope de repeticiones, guía de RIR y glosario, gráficas y récords.
- Fuera de v1: cuentas y login, sincronización, panel del entrenador, clips propios, notificaciones push, modo claro.
- Sin librería pesada de gráficas. Objetivos táctiles de 44 px o más, `safe-area`, `prefers-reduced-motion`.

## Brand Commitments

Marca aprobada: Cima. Símbolo de pico con tres peldaños iguales y diagonal de 60°, logotipo CIMA construido a trazos (C con cortes de 45°, M y A con diagonal de 60°). Terracota `#C8633F` como color de marca y acción principal; grafito `#141312`, `#1B1A19`, hueso `#F2EEE8`, piedra `#A39C93`. App oscura. Firma discreta "Hecho por somospits.com.co" en el pie y en ajustes, sin logo de Pits. Archivos en `identidad/`.

## Evidence on Hand

Rutina completa en `Downloads/plan_de_entrenamiento_semanal_5_d_as.md`. Identidad en `identidad/` (logos, iconos PWA, guía, paleta). No hay fotos, clips propios ni testimonios, y no se deben inventar.

## Product Principles

1. Enseñar sin abrumar: cada ejercicio explica lo mínimo para ejecutarlo bien.
2. Registrar en el menor número de toques posible, con valores precargados.
3. El progreso se muestra con datos reales de la clienta, nunca decorado.
4. Un solo color de acción por pantalla; el resto es neutro.
5. Funciona en el gimnasio: una mano, poca luz, pantalla siempre encendida.

## Accessibility & Inclusion

Contraste mínimo 4.5:1 en texto. Movimiento reducido respetado. Cifras tabulares. Textos en español claro, sin jerga sin explicar.
