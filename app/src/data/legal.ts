/**
 * Textos legales de Cima (Colombia).
 * Cambia LEGAL.version cuando cambie cualquier texto: la app vuelve a pedir la aceptación.
 * Completa `razonSocial`, `nit` y `email` cuando los tengas: aparecen solos en los textos.
 */
export const LEGAL = {
  version: '2026-11-27',
  fecha: '27 de noviembre de 2026',
  marca: 'Cima',
  responsable: 'somospits.com.co',
  sitio: 'https://somospits.com.co',
  razonSocial: '' as string, // ej. 'Pits S.A.S.'
  nit: '' as string, // ej. '900.000.000-0'
  email: '' as string, // correo para solicitudes de datos y reclamos
}

export interface LegalSection {
  h: string
  p: string[]
}
export interface LegalDoc {
  id: 'terminos' | 'privacidad' | 'salud' | 'licencias'
  title: string
  short: string
  intro: string
  sections: LegalSection[]
}

const quien = () =>
  LEGAL.razonSocial
    ? `${LEGAL.razonSocial}${LEGAL.nit ? `, NIT ${LEGAL.nit}` : ''}, que opera ${LEGAL.responsable}`
    : LEGAL.responsable

const contacto = () =>
  LEGAL.email ? `escribiendo a ${LEGAL.email} o por ${LEGAL.sitio.replace('https://', '')}` : `por ${LEGAL.sitio.replace('https://', '')}`

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'terminos',
    title: 'Términos de uso',
    short: 'Las reglas para usar Cima',
    intro: `Estos términos regulan el uso de Cima. Versión del ${LEGAL.fecha}. Al usar la app aceptas lo que dicen aquí.`,
    sections: [
      {
        h: '1. Quién ofrece Cima',
        p: [`Cima es una aplicación gratuita para organizar y registrar rutinas de gimnasio. La ofrece ${quien()} (“nosotros”).`],
      },
      {
        h: '2. Aceptación y edad',
        p: [
          'Al marcar la casilla de aceptación y usar Cima, aceptas estos términos, la Política de privacidad y el Aviso de salud.',
          'Si eres menor de 18 años, usa Cima solo con la autorización y el acompañamiento de tu madre, padre o acudiente. Si no estás de acuerdo con alguno de estos textos, no uses la app.',
        ],
      },
      {
        h: '3. Qué es Cima y qué no es',
        p: [
          'Cima es una herramienta para ver tu rutina, registrar peso y repeticiones, y seguir tu progreso.',
          'Cima no es un entrenador personal, ni un médico, ni un fisioterapeuta, ni un nutricionista. Las rutinas, los pesos sugeridos y las pistas de técnica son orientaciones generales y no reemplazan la guía de un profesional. Lee el Aviso de salud.',
        ],
      },
      {
        h: '4. Uso permitido',
        p: [
          'Puedes usar Cima para tu entrenamiento personal y no comercial.',
          'No puedes usar la app para fines ilícitos, intentar vulnerarla o interferir con su funcionamiento, hacerla pasar por tuya, ni copiar, revender o redistribuir su contenido, diseño o código sin permiso escrito.',
        ],
      },
      {
        h: '5. Tus datos y tus respaldos',
        p: [
          'Tu progreso se guarda únicamente en tu dispositivo. No tenemos copia y no podemos recuperarlo.',
          'Si borras los datos del navegador, desinstalas la app, cambias de teléfono o usas la función Borrar datos, tu progreso se pierde. Eres responsable de guardar respaldos desde Ajustes.',
        ],
      },
      {
        h: '6. Propiedad intelectual',
        p: [
          `El nombre y la marca Cima, el diseño, los textos, las ilustraciones y el código son de ${LEGAL.responsable} o de sus licenciantes y están protegidos por las normas de derechos de autor y propiedad industrial de Colombia (Ley 23 de 1982 y Decisión Andina 351 de 1993).`,
          'Te damos una licencia personal, no exclusiva, revocable e intransferible para usar la app. No se te transfiere ningún otro derecho.',
          'Los videos y marcas de terceros pertenecen a sus titulares. Más detalle en Licencias y créditos.',
        ],
      },
      {
        h: '7. Contenido de terceros y rutinas compartidas',
        p: [
          'Puedes crear tus propias rutinas y compartirlas con otras personas mediante un enlace. Eres responsable de lo que escribes y de a quién se lo envías.',
          'Cima no revisa, no avala y no responde por las rutinas creadas por ti o por otras personas. Antes de seguir una rutina recibida, lee el Aviso de salud. No uses Cima para compartir contenido ilícito, ofensivo o que infrinja derechos de terceros.',
          'Los videos de “Cómo se hace” son de YouTube y de sus creadores. Se muestran con el reproductor incrustado de YouTube y, al verlos, aplican los términos y la política de privacidad de YouTube y Google.',
          'No controlamos ese contenido ni respondemos por él. Podemos cambiar o retirar un video o un enlace en cualquier momento.',
        ],
      },
      {
        h: '8. Disponibilidad y cambios en la app',
        p: [
          'Ofrecemos Cima “tal como está”. Puede cambiar, actualizarse o interrumpirse sin aviso previo, y no garantizamos que funcione sin errores ni de forma ininterrumpida.',
          'Al ser una app instalable, las nuevas versiones se descargan solas cuando hay conexión.',
        ],
      },
      {
        h: '9. Límite de responsabilidad',
        p: [
          'En la medida en que la ley colombiana lo permite, no somos responsables por lesiones o daños que resulten de tu entrenamiento, de seguir o malinterpretar una rutina, un peso sugerido o un video, ni por la pérdida de tus datos, ni por fallas del dispositivo, de la red o de servicios de terceros.',
          'Nada de lo anterior excluye la responsabilidad que la ley no permite excluir, como la derivada de dolo o culpa grave, ni limita los derechos que tengas como consumidor (Ley 1480 de 2011).',
        ],
      },
      {
        h: '10. Cambios en estos términos',
        p: [
          'Podemos actualizar estos términos. Cuando el cambio sea importante, la app te pedirá aceptar la nueva versión para seguir usándola. La fecha de la versión vigente está al comienzo de cada documento.',
        ],
      },
      {
        h: '11. Ley aplicable y jurisdicción',
        p: ['Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá ante las autoridades colombianas competentes.'],
      },
      {
        h: '12. Contacto',
        p: [`Para dudas, reclamos o avisos sobre derechos de autor, comunícate ${contacto()}.`],
      },
    ],
  },
  {
    id: 'privacidad',
    title: 'Política de privacidad',
    short: 'Qué datos guarda Cima y tus derechos',
    intro: `Política de tratamiento de datos personales de Cima, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios. Versión del ${LEGAL.fecha}.`,
    sections: [
      {
        h: '1. En resumen',
        p: [
          'Cima no tiene cuentas, no pide tu nombre, correo ni teléfono, no muestra anuncios y no usa analítica ni cookies de seguimiento.',
          'Tu progreso vive en tu dispositivo y no lo enviamos a ningún servidor nuestro.',
        ],
      },
      {
        h: '2. Responsable del tratamiento',
        p: [
          `${quien()}. Puedes contactarnos ${contacto()}.`,
          'Como los datos de tu entrenamiento nunca salen de tu dispositivo, no los recibimos, no los almacenamos y no podemos consultarlos ni modificarlos.',
        ],
      },
      {
        h: '3. Qué se guarda en tu dispositivo',
        p: [
          'Se guardan las fechas de tus sesiones, el peso y las repeticiones de cada serie, las rutinas que creas o recibes (los nombres que tú escribes para días y ejercicios), la fecha en que instalaste la app, la fecha de tu último respaldo y la versión de los textos legales que aceptaste.',
          'Cuando compartes una rutina, su contenido viaja dentro del enlace que envías. No se sube a ningún servidor nuestro y no lo vemos. Quien reciba el enlace puede leerla; compártelo solo con quien quieras.',
          'La finalidad es una sola: mostrarte tu rutina y tu progreso. No pedimos ubicación, fotos, contactos ni datos de salud.',
        ],
      },
      {
        h: '4. Qué pasa en la red',
        p: [
          'Para entregarte la app usamos Cloudflare como alojamiento. Como cualquier sitio web, sus servidores pueden registrar datos técnicos de la conexión (dirección IP, tipo de navegador, fecha y hora) por seguridad y funcionamiento.',
          'Al abrir “Cómo se hace” se carga una miniatura desde servidores de Google (i.ytimg.com). Si tocas reproducir, se carga el video desde youtube-nocookie.com. En esos momentos Google puede recibir tu dirección IP y datos de tu dispositivo, según su propia política de privacidad.',
          'Las tipografías de la app se sirven desde la propia app; no se usa Google Fonts.',
        ],
      },
      {
        h: '5. Autorización',
        p: [
          'Al aceptar estos textos y usar la app nos autorizas a tratar, en tu propio dispositivo, los datos descritos arriba para la finalidad indicada. Puedes revocar esa autorización en cualquier momento borrando tus datos desde Ajustes o desinstalando la app.',
        ],
      },
      {
        h: '6. Tus derechos',
        p: [
          'Como titular tienes derecho a conocer, actualizar y rectificar tus datos, a solicitar prueba de la autorización, a ser informado del uso que se les da, a presentar quejas ante la Superintendencia de Industria y Comercio, a revocar la autorización o solicitar la supresión de tus datos, y a acceder a ellos de forma gratuita (artículo 8 de la Ley 1581 de 2012).',
          'Puedes ejercerlos tú mismo en la app: Guardar respaldo te entrega todos tus datos en un archivo y Borrar datos los elimina de inmediato.',
          `Para cualquier otra consulta o reclamo, comunícate ${contacto()}. Responderemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15 días hábiles, prorrogables según la ley.`,
        ],
      },
      {
        h: '7. Datos sensibles y menores de edad',
        p: [
          'Cima no solicita datos sensibles ni los usa para deducir información de tu salud.',
          'Cima no recolecta datos de menores de edad en sus servidores. Si eres menor de 18 años, úsala con el acompañamiento de tu madre, padre o acudiente.',
        ],
      },
      {
        h: '8. Seguridad y conservación',
        p: [
          'Tus datos se conservan en tu dispositivo hasta que los borres. Protege tu teléfono con un bloqueo de pantalla.',
          'El archivo de respaldo no está cifrado: quien lo tenga puede leerlo. Guárdalo y compártelo con cuidado.',
        ],
      },
      {
        h: '9. Transferencias a terceros',
        p: ['No vendemos ni compartimos tus datos de entrenamiento. Los proveedores técnicos de la sección 4 pueden tratar datos de conexión fuera de Colombia, bajo sus propias políticas.'],
      },
      {
        h: '10. Cambios y autoridad',
        p: [
          'Si cambia esta política, te pediremos aceptar la nueva versión.',
          'La autoridad de protección de datos en Colombia es la Superintendencia de Industria y Comercio (sic.gov.co).',
        ],
      },
    ],
  },
  {
    id: 'salud',
    title: 'Aviso de salud',
    short: 'Antes de entrenar',
    intro: `Léelo antes de empezar. Versión del ${LEGAL.fecha}.`,
    sections: [
      {
        h: 'No es consejo médico',
        p: [
          'Cima ofrece información general de entrenamiento. No diagnostica, no trata y no reemplaza la valoración de un médico, fisioterapeuta o entrenador calificado.',
        ],
      },
      {
        h: 'Antes de empezar',
        p: [
          'Consulta a tu médico antes de iniciar o cambiar un programa de ejercicio, sobre todo si estás embarazada o en posparto, tienes una lesión, dolor, problemas del corazón, presión alta, diabetes, mareos frecuentes o cualquier condición de salud.',
        ],
      },
      {
        h: 'Durante el entrenamiento',
        p: [
          'Detente si sientes dolor agudo, mareo, falta de aire, dolor o presión en el pecho o cualquier malestar fuera de lo normal, y busca atención médica. En Colombia, la línea de emergencias es el 123.',
          'Calienta antes de empezar. Usa los seguros de la barra y de las máquinas, revisa el equipo y pide a alguien que te asista cuando levantes pesos exigentes.',
        ],
      },
      {
        h: 'Pesos, repeticiones y técnica',
        p: [
          'Los pesos sugeridos son una referencia calculada con lo que registras, no una prescripción. Elige siempre un peso que puedas controlar con buena técnica.',
          'Los videos y las pistas son una guía y pueden no ajustarse a tu cuerpo o a tus limitaciones. Un profesional puede corregir tu técnica en persona.',
        ],
      },
      {
        h: 'Rutinas de otras personas',
        p: ['Una rutina que te comparte un amigo o que armas tú no está evaluada por un profesional y puede no ser adecuada para ti. Revisa series, repeticiones y pesos, y ajústalos a tu nivel.'],
      },
      {
        h: 'Tu responsabilidad',
        p: ['Entrenas bajo tu propia responsabilidad y asumes los riesgos propios de la actividad física. Cima no incluye recomendaciones de alimentación ni de suplementos.'],
      },
    ],
  },
  {
    id: 'licencias',
    title: 'Licencias y créditos',
    short: 'Software libre, tipografías y videos',
    intro: `Cima se construye sobre trabajo de otras personas. Estos son sus créditos. Versión del ${LEGAL.fecha}.`,
    sections: [
      {
        h: 'Cima',
        p: [`© 2026 ${LEGAL.responsable}. Todos los derechos reservados sobre el nombre, el diseño, los textos y el código de la app, salvo lo indicado abajo.`],
      },
      {
        h: 'Tipografías',
        p: [
          'Barlow y Barlow Condensed. Copyright The Barlow Project Authors. Licencia SIL Open Font License 1.1 (openfontlicense.org).',
        ],
      },
      {
        h: 'Software libre incluido',
        p: [
          'Preact, licencia MIT.',
          'Dexie.js, licencia Apache 2.0.',
          'Workbox y vite-plugin-pwa, licencia MIT. Vite, licencia MIT.',
          'Los textos completos de esas licencias están en los repositorios de cada proyecto.',
        ],
      },
      {
        h: 'Videos',
        p: [
          'Los videos de “Cómo se hace” pertenecen a sus creadores en YouTube. Cima no los aloja ni los copia: solo enlaza el reproductor oficial incrustado.',
          `Si eres titular de un video y quieres que lo retiremos, escríbenos ${contacto()}.`,
        ],
      },
      {
        h: 'Marcas',
        p: ['YouTube y Google son marcas de Google LLC. Cima no está afiliada ni respaldada por ellas.'],
      },
    ],
  },
]

export const legalDoc = (id: string) => LEGAL_DOCS.find((d) => d.id === id)
