// Rutina de 5 días. Fuente: plan_de_entrenamiento_semanal_5_d_as.md
// Para cambiar un ejercicio, un video o una pista, se edita solo este archivo.
// Sube ROUTINE_VERSION cuando cambies la rutina; el historial se enlaza por `id`.

export const ROUTINE_VERSION = 1

export type Implement = 'barra' | 'mancuernas' | 'maquina' | 'polea' | 'cuerpo' | 'libre'

export interface Exercise {
  id: string
  name: string
  sets: number
  repsMin: number
  repsMax: number
  /** Las repeticiones son por lado (c/u). */
  perSide?: boolean
  restSec: number
  implement: Implement
  /** Incremento de peso en kg al ajustar con + y −. */
  step: number
  /** Nota técnica del plan, tal cual. */
  note: string
  /** Pistas cortas para quien sabe poco de técnica. */
  cues: string[]
  /** ID del video de YouTube. Pendiente de verificar en v1. */
  youtubeId?: string
  /** Texto para buscar el video si aún no hay youtubeId. */
  search: string
}

export interface Day {
  id: string
  n: number
  name: string
  focus: string
  summary: string
  exercises: Exercise[]
}

const ex = (e: Exercise): Exercise => e

const extensionCuadriceps = ex({
  id: 'extension-cuadriceps',
  name: 'Extensión de cuádriceps en máquina',
  sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'maquina', step: 2.5,
  note: 'Sube explosivo, sostén 1 segundo arriba y baja en 2–3 segundos.',
  cues: ['Sube con fuerza y sostén 1 segundo arriba.', 'Baja despacio, en 2 o 3 segundos.', 'No bloquees las rodillas de golpe.'],
  search: 'extensión de cuádriceps en máquina técnica', youtubeId: 'Q2-N3JmOQvI',
})

export const ROUTINE: Day[] = [
  {
    id: 'dia-1', n: 1, name: 'Cadena posterior', focus: 'Glúteo y femoral',
    summary: 'Contracción máxima del glúteo, bisagra de cadera y flexión de rodilla.',
    exercises: [
      ex({ id: 'hip-thrust', name: 'Hip thrust', sets: 4, repsMin: 8, repsMax: 10, restSec: 180, implement: 'barra', step: 2.5,
        note: 'Pausa de 1 segundo arriba apretando glúteos con retroversión pélvica (mirada al frente).',
        cues: ['Aprieta los glúteos arriba y pausa 1 segundo.', 'Mira al frente y mete un poco la pelvis.', 'Empuja con los talones.'],
        search: 'hip thrust con barra técnica correcta', youtubeId: 'efe-QObKAZU' }),
      ex({ id: 'peso-muerto-rumano', name: 'Peso muerto rumano', sets: 3, repsMin: 8, repsMax: 10, restSec: 180, implement: 'barra', step: 2.5,
        note: 'Con barra o mancuernas. Lleva la cadera hacia atrás y frena el descenso cuando deje de bajar la cadera.',
        cues: ['Lleva la cadera hacia atrás, como si cerraras una puerta con ella.', 'Rodillas casi estiradas y espalda recta.', 'Baja hasta donde la cadera deje de irse atrás.'],
        search: 'peso muerto rumano técnica correcta', youtubeId: '99aPIw8XxRg' }),
      ex({ id: 'curl-femoral-sentado', name: 'Curl femoral sentado', sets: 3, repsMin: 10, repsMax: 12, restSec: 120, implement: 'maquina', step: 2.5,
        note: 'Mantén la espalda bien apoyada en el respaldo; controla la subida en 2–3 segundos.',
        cues: ['Espalda pegada al respaldo.', 'Controla el movimiento, 2 o 3 segundos.', 'No levantes la cadera del asiento.'],
        search: 'curl femoral sentado en máquina técnica', youtubeId: 'H_ADCsf0JOw' }),
      ex({ id: 'prensa-pies-altos', name: 'Prensa de piernas, pies altos y anchos', sets: 3, repsMin: 10, repsMax: 12, restSec: 180, implement: 'maquina', step: 5,
        note: 'Coloca los pies en la parte superior de la plataforma para enfatizar el trabajo de glúteo.',
        cues: ['Pies arriba y un poco abiertos en la plataforma.', 'Baja hasta donde la espalda baja siga pegada.', 'Empuja con todo el pie, sin despegar los talones.'],
        search: 'prensa de piernas pies altos glúteo técnica', youtubeId: 'xvCynwyNoP4' }),
      ex({ id: 'patada-gluteo-polea', name: 'Patada de glúteo en polea', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'polea', step: 2.5,
        note: 'Mantén el abdomen firme y evita arquear la espalda baja al llevar la pierna atrás.',
        cues: ['Abdomen firme y espalda sin arquear.', 'Lleva la pierna atrás, sin balancear el cuerpo.', 'Aprieta el glúteo al final.'],
        search: 'patada de glúteo en polea técnica', youtubeId: '39zOeQRHhGk' }),
      ex({ id: 'abduccion-maquina', name: 'Abducción de cadera en máquina', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'maquina', step: 2.5,
        note: 'Inclina ligeramente el torso hacia adelante para enfocar el glúteo medio y superior.',
        cues: ['Inclina un poco el torso hacia adelante.', 'Abre con control y sin rebotes.', 'Siente el trabajo en la parte alta del glúteo.'],
        search: 'abducción de cadera en máquina glúteo medio técnica', youtubeId: '2vCRMi-lgJ4' }),
    ],
  },
  {
    id: 'dia-2', n: 2, name: 'Push', focus: 'Hombro, pecho y tríceps',
    summary: 'Deltoide lateral y anterior, pectoral superior y tríceps en dos ángulos.',
    exercises: [
      ex({ id: 'press-militar', name: 'Press militar', sets: 3, repsMin: 8, repsMax: 10, restSec: 150, implement: 'mancuernas', step: 1,
        note: 'Mantén los codos ligeramente por delante del torso (~30°) para cuidar la articulación del hombro.',
        cues: ['Codos un poco por delante del cuerpo.', 'Empuja hacia arriba sin arquear la espalda.', 'Baja con control hasta la altura de las orejas.'],
        search: 'press militar con mancuernas técnica hombro', youtubeId: 'o5M9RZ-vWrc' }),
      ex({ id: 'elevaciones-laterales', name: 'Elevaciones laterales', sets: 4, repsMin: 12, repsMax: 15, restSec: 90, implement: 'mancuernas', step: 1,
        note: 'Sube los brazos hacia los lados sin encoger los trapecios; controla la bajada.',
        cues: ['Sube los brazos hacia los lados, no hacia el techo.', 'Hombros lejos de las orejas.', 'Baja despacio.'],
        search: 'elevaciones laterales técnica correcta deltoide lateral', youtubeId: 'nOAUECQEpHs' }),
      ex({ id: 'press-inclinado', name: 'Press inclinado', sets: 3, repsMin: 10, repsMax: 12, restSec: 150, implement: 'mancuernas', step: 2,
        note: 'Banco a 30°–45° para estimular la parte superior del pecho.',
        cues: ['Banco entre 30° y 45°.', 'Empuja hacia arriba y un poco hacia adentro.', 'Baja hasta sentir estirado el pecho.'],
        search: 'press inclinado con mancuernas técnica pecho superior', youtubeId: 'ULxNmcGpzA0' }),
      ex({ id: 'peck-deck', name: 'Peck deck, aperturas en máquina', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'maquina', step: 2.5,
        note: 'Junta los brazos al frente de forma fluida y controla la apertura sin perder tensión.',
        cues: ['Junta los brazos al frente con fluidez.', 'Abre despacio y sin perder tensión.', 'Pecho arriba y hombros abajo.'],
        search: 'peck deck aperturas en máquina técnica', youtubeId: 'qeKeh-bywRw' }),
      ex({ id: 'triceps-polea-alta', name: 'Extensión de tríceps hacia abajo en polea alta', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'polea', step: 2.5,
        note: 'Mantén los codos pegados a los costados durante todo el recorrido.',
        cues: ['Codos pegados a las costillas todo el tiempo.', 'Estira del todo abajo.', 'Sube sin separar los codos.'],
        search: 'extensión de tríceps en polea alta técnica', youtubeId: 'HAS8uy73HqM' }),
      ex({ id: 'triceps-tras-nuca', name: 'Extensión de tríceps tras nuca', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'polea', step: 2.5,
        note: 'Con polea baja o mancuerna; busca un estiramiento completo del tríceps detrás de la cabeza.',
        cues: ['Estira bien el tríceps detrás de la cabeza.', 'Codos apuntando hacia arriba, quietos.', 'Estira del todo al subir.'],
        search: 'extensión de tríceps tras nuca polea técnica', youtubeId: 'P40-DvgM9qI' }),
    ],
  },
  {
    id: 'dia-3', n: 3, name: 'Cadena anterior', focus: 'Cuádriceps y aductores',
    summary: 'Flexión profunda de rodilla para cuádriceps con estabilidad y cuidando la zona lumbar.',
    exercises: [
      ex({ id: 'sentadilla-hack', name: 'Sentadilla hack o pendulum', sets: 4, repsMin: 8, repsMax: 10, restSec: 180, implement: 'maquina', step: 5,
        note: 'Pies un poco más abajo en la plataforma para permitir que las rodillas avancen cómodamente.',
        cues: ['Pies un poco más abajo en la plataforma.', 'Deja que las rodillas avancen.', 'Baja profundo, con espalda pegada al respaldo.'],
        search: 'sentadilla hack técnica cuádriceps', youtubeId: 'P5GKCErO54g' }),
      ex({ id: 'sentadilla-bulgara', name: 'Sentadilla búlgara', sets: 3, repsMin: 8, repsMax: 10, perSide: true, restSec: 150, implement: 'mancuernas', step: 2,
        note: 'Paso corto y torso lo más vertical posible para centrar el esfuerzo en el cuádriceps.',
        cues: ['Paso corto y torso erguido.', 'Baja recto, sin inclinarte adelante.', 'Haz todas las repeticiones de una pierna y luego cambia.'],
        search: 'sentadilla búlgara técnica cuádriceps', youtubeId: 'giVdHLHtsIw' }),
      extensionCuadriceps,
      ex({ id: 'aduccion-maquina', name: 'Aducción de cadera en máquina', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'maquina', step: 2.5,
        note: 'Movimiento controlado, pausando brevemente en la apertura máxima.',
        cues: ['Movimiento controlado.', 'Pausa un instante con las piernas abiertas.', 'Cierra sin dar golpes.'],
        search: 'aducción de cadera en máquina técnica', youtubeId: '9EuO_mMQ3i8' }),
      ex({ id: 'gemelos-de-pie', name: 'Elevación de talones de pie', sets: 4, repsMin: 10, repsMax: 12, restSec: 90, implement: 'maquina', step: 5,
        note: 'Haz una pausa de 2 segundos abajo (en estiramiento) en cada repetición para evitar rebotes.',
        cues: ['Baja del todo y pausa 2 segundos abajo.', 'Sube lo más alto que puedas.', 'Sin rebotes.'],
        search: 'elevación de talones de pie gemelos técnica', youtubeId: 'clKN9iA7_Qc' }),
    ],
  },
  {
    id: 'dia-4', n: 4, name: 'Pull', focus: 'Espalda, hombro posterior y bíceps',
    summary: 'Tracciones verticales y horizontales para postura, línea de la espalda y brazos.',
    exercises: [
      ex({ id: 'jalon-pecho', name: 'Jalón al pecho', sets: 4, repsMin: 8, repsMax: 12, restSec: 150, implement: 'polea', step: 2.5,
        note: 'Lleva la barra hacia la parte alta del pecho dirigiendo los codos hacia abajo, sin balancearte.',
        cues: ['Lleva la barra a la parte alta del pecho.', 'Codos hacia abajo y atrás.', 'Sin balancear el torso.'],
        search: 'jalón al pecho técnica dorsal', youtubeId: 'oLQj4fySWQQ' }),
      ex({ id: 'remo-unilateral', name: 'Remo unilateral en máquina o polea baja', sets: 3, repsMin: 10, repsMax: 12, restSec: 120, implement: 'maquina', step: 2.5,
        note: 'Mantén el pecho apoyado o el torso estable; lleva el codo hacia la cadera.',
        cues: ['Pecho apoyado o torso quieto.', 'Lleva el codo hacia la cadera.', 'Vuelve despacio hasta estirar el brazo.'],
        search: 'remo unilateral en máquina técnica espalda', youtubeId: 'Uuy3QJAWaqk' }),
      ex({ id: 'pullover-polea', name: 'Pull-over en polea alta con cuerda', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'polea', step: 2.5,
        note: 'Brazos casi estirados, lleva la cuerda desde arriba hacia tus muslos sintiendo el dorsal.',
        cues: ['Brazos casi estirados.', 'Lleva la cuerda desde arriba hasta los muslos.', 'Siente el trabajo en el costado de la espalda.'],
        search: 'pullover en polea alta con cuerda técnica', youtubeId: '-UrSFw0QPHs' }),
      ex({ id: 'pajaros-maquina', name: 'Pájaros en máquina', sets: 4, repsMin: 12, repsMax: 15, restSec: 90, implement: 'maquina', step: 2.5,
        note: 'Abre los brazos hacia atrás pensando en alejar los nudillos, sin juntar demasiado los omóplatos.',
        cues: ['Abre los brazos hacia atrás.', 'Piensa en alejar los nudillos.', 'No juntes demasiado los omóplatos.'],
        search: 'pájaros en máquina reverse pec deck técnica', youtubeId: 'TtJmmR2RuHU' }),
      ex({ id: 'curl-biceps-inclinado', name: 'Curl de bíceps en banco inclinado', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'mancuernas', step: 1,
        note: 'Deja colgar los brazos hacia atrás para estirar bien el bíceps antes de flexionar.',
        cues: ['Banco entre 45° y 60°.', 'Deja los brazos colgando hacia atrás.', 'Sube sin mover los codos.'],
        search: 'curl de bíceps en banco inclinado técnica', youtubeId: 'nw2Y9iHHzlU' }),
      ex({ id: 'curl-martillo', name: 'Curl martillo', sets: 3, repsMin: 10, repsMax: 12, restSec: 90, implement: 'mancuernas', step: 1,
        note: 'Agarre neutro (palmas enfrentadas) para trabajar bíceps y antebrazo.',
        cues: ['Palmas enfrentadas, como sosteniendo un martillo.', 'Codos pegados al cuerpo.', 'Baja despacio.'],
        search: 'curl martillo con mancuernas técnica', youtubeId: 'znTSJ_2zJN0' }),
    ],
  },
  {
    id: 'dia-5', n: 5, name: 'Full leg', focus: 'Pierna completa y femoral',
    summary: 'Cierre semanal: doble estímulo para femoral, cuádriceps y glúteo, con aislamiento final.',
    exercises: [
      ex({ id: 'curl-femoral-tumbado', name: 'Curl femoral tumbado', sets: 4, repsMin: 10, repsMax: 12, restSec: 120, implement: 'maquina', step: 2.5,
        note: 'Mantén la cadera pegada al banco al flexionar las rodillas (evita levantar los glúteos).',
        cues: ['Cadera pegada al banco.', 'Dobla las rodillas sin levantar los glúteos.', 'Baja despacio.'],
        search: 'curl femoral tumbado en máquina técnica', youtubeId: 'kmtn5RJkvVE' }),
      ex({ id: 'prensa-inclinada', name: 'Prensa inclinada', sets: 4, repsMin: 8, repsMax: 12, restSec: 180, implement: 'maquina', step: 5,
        note: 'Pies al ancho de hombros en el centro de la plataforma para trabajo equilibrado de pierna.',
        cues: ['Pies al ancho de los hombros, en el centro.', 'Baja hasta donde la espalda baja siga pegada.', 'Empuja sin despegar los talones.'],
        search: 'prensa inclinada técnica piernas', youtubeId: 'bNsrqXUIJqc' }),
      ex({ id: 'buenos-dias-smith', name: 'Buenos días en Smith o peso muerto con piernas semirrígidas', sets: 3, repsMin: 10, repsMax: 12, restSec: 150, implement: 'barra', step: 2.5,
        note: 'Rodillas ligeramente flexionadas y fijas; baja el torso hasta sentir tensión máxima en femorales.',
        cues: ['Rodillas un poco dobladas y quietas.', 'Baja el torso con la espalda recta.', 'Baja hasta sentir el femoral muy estirado.'],
        search: 'buenos días en máquina Smith técnica femoral', youtubeId: 'B44jZpZ97Hs' }),
      ex({ id: 'zancadas-stepup', name: 'Zancadas caminando o step-up en cajón', sets: 3, repsMin: 10, repsMax: 12, perSide: true, restSec: 150, implement: 'mancuernas', step: 2,
        note: 'Controla el descenso y empuja fuerte desde el talón de la pierna delantera.',
        cues: ['Controla el descenso.', 'Empuja desde el talón de la pierna de adelante.', 'Torso firme.'],
        search: 'zancadas caminando técnica glúteo cuádriceps', youtubeId: 'uqvt79Uh4o4' }),
      extensionCuadriceps,
      ex({ id: 'hiperextensiones', name: 'Hiperextensiones en banco a 45°', sets: 3, repsMin: 12, repsMax: 15, restSec: 90, implement: 'cuerpo', step: 2.5,
        note: 'Redondea ligeramente la espalda alta, barbilla al pecho y sube empujando con glúteos y femorales.',
        cues: ['Espalda alta ligeramente redondeada, barbilla al pecho.', 'Sube empujando con glúteos y femorales.', 'No te pases de la línea del cuerpo arriba.'],
        search: 'hiperextensiones banco 45 grados glúteo técnica', youtubeId: 'bVyv_mPXlPo' }),
    ],
  },
]

export const ALL_EXERCISES: Exercise[] = Array.from(new Map(ROUTINE.flatMap((d) => d.exercises).map((e) => [e.id, e])).values())

export const exerciseById = (id: string): Exercise | undefined => ALL_EXERCISES.find((e) => e.id === id)
export const dayById = (id: string): Day | undefined => ROUTINE.find((d) => d.id === id)
export const dayOfExercise = (id: string): Day | undefined => ROUTINE.find((d) => d.exercises.some((e) => e.id === id))
