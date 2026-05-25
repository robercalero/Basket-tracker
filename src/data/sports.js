export const SPORTS = [
  {
    id: 'basketball',
    name: 'Básquetbol',
    emoji: '🏀',
    attributes: [
      { id: 'vertical', name: 'Salto Vertical', emoji: '⬆️' },
      { id: 'explosive', name: 'Potencia Explosiva', emoji: '💥' },
      { id: 'lateral', name: 'Agilidad Lateral', emoji: '↔️' },
      { id: 'speed', name: 'Velocidad', emoji: '🏃' },
      { id: 'core', name: 'Core Estable', emoji: '🧊' },
      { id: 'endurance', name: 'Resistencia', emoji: '❤️' },
      { id: 'strength', name: 'Fuerza Funcional', emoji: '💪' },
    ],
    exerciseBenefits: {
      'press-banca-plano': 'Desarrolla fuerza de empuje horizontal, útil para rechazar defensores y proteger el balón con el torso.',
      'press-banca-inclinado': 'Fortalece el pectoral superior, mejora la estabilidad al tirar de media-larga distancia.',
      'sentadilla-barra': 'Base de la potencia de piernas para saltar, cambiar de dirección y defender en posición baja.',
      'peso-muerto': 'Cadena posterior completa, esencial para salto vertical y sprint inicial.',
      'peso-muerto-rumano': 'Aísla isquiotibiales, previene lesiones de isquio en sprints y cambios de ritmo.',
      'prensa-piernas': 'Desarrolla fuerza bruta de piernas para empuje vertical y rebote.',
      'remo-barra': 'Fortalece espalda media, mejora la postura al correr y la estabilidad del tronco en contacto.',
      'jalon-polea-alta': 'Simula el movimiento de atraer el balón hacia el cuerpo, fortalece dorsales y bíceps.',
      'press-hombro-barra': 'Potencia de empuje vertical, útil para rebotear y proteger el balón arriba.',
      'elev-laterales': 'Fortalece el manguito rotador, previene lesiones de hombro por lanzamientos repetitivos.',
      'curl-barra': 'Fortalece bíceps para proteger el balón en penetraciones y dribbling bajo presión.',
      'extension-triceps': 'Potencia de extensión de brazos, mejora el pase de largo alcance y el tiro.',
      'face-pull': 'Equilibrio postural, previene hombros caídos por lanzamiento repetitivo.',
      'peso-muerto-sumo': 'Cadena posterior con énfasis en aductores, mejora la base defensiva amplia.',
      'sentadilla-frontal': 'Cuádriceps y core, mejora la capacidad de frenar y cambiar dirección.',
      'zancadas': 'Trabajo unilateral, corrige descompensaciones y mejora el empuje en cada paso.',
      'ab-wheel': 'Core profundo, esencial para estabilidad en el aire en bandejas y rebotes.',
      'plancha-lastre': 'Resistencia de core, mejora la capacidad de absorber contacto sin perder el equilibrio.',
      'elev-talones': 'Fortalece pantorrillas para empuje final en salto y absorción de aterrizaje.',
      'curl-femoral': 'Aísla isquiotibiales, clave para frenar y cambiar dirección sin lesión.',
      'extension-quad': 'Fortalece cuádriceps para la recepción de saltos y cambios de ritmo.',
    },
  },
  {
    id: 'football',
    name: 'Fútbol',
    emoji: '⚽',
    attributes: [
      { id: 'speed', name: 'Velocidad', emoji: '🏃' },
      { id: 'explosive', name: 'Potencia Explosiva', emoji: '💥' },
      { id: 'agility', name: 'Agilidad', emoji: '↔️' },
      { id: 'endurance', name: 'Resistencia', emoji: '❤️' },
      { id: 'core', name: 'Core Estable', emoji: '🧊' },
      { id: 'strength', name: 'Fuerza Funcional', emoji: '💪' },
    ],
    exerciseBenefits: {
      'sentadilla-barra': 'Base de potencia para sprints, saltos en centros y duelos aéreos.',
      'peso-muerto': 'Cadena posterior para aceleración inicial y golpeo potente.',
      'peso-muerto-rumano': 'Previene lesiones de isquio en sprints máximos.',
      'zancadas': 'Trabajo unilateral esencial para la pisada en carrera y cambios de dirección.',
      'prensa-piernas': 'Fuerza bruta para empujar en duelos y proteger el balón con el cuerpo.',
      'plancha-lastre': 'Estabilidad de core para aguantar empujones y girar con control.',
      'remo-barra': 'Fortalece espalda para proteger el balón de espaldas a portería.',
      'press-hombro-barra': 'Empuje en duelos aéreos y protección del balón.',
      'curl-barra': 'Protección del balón en conducción bajo presión.',
      'extension-triceps': 'Potencia de lanzamiento de banda y despejes largos.',
      'elev-talones': 'Empuje plantar para aceleración y cambios de ritmo.',
    },
  },
  {
    id: 'running',
    name: 'Running',
    emoji: '🏃',
    attributes: [
      { id: 'endurance', name: 'Resistencia', emoji: '❤️' },
      { id: 'speed', name: 'Velocidad', emoji: '🏃' },
      { id: 'core', name: 'Core Estable', emoji: '🧊' },
      { id: 'strength', name: 'Fuerza Resistencia', emoji: '💪' },
    ],
    exerciseBenefits: {
      'peso-muerto-rumano': 'Fortalece isquiotibiales para prevenir tirones en carrera larga.',
      'sentadilla-barra': 'Base de fuerza para mantener zancada eficiente en km finales.',
      'prensa-piernas': 'Resistencia de piernas para mantener ritmo en cuestas.',
      'curl-femoral': 'Equilibrio muscular entre quads e isquios para prevenir lesiones.',
      'plancha-lastre': 'Core estable mejora la economía de carrera y previene lumbalgias.',
      'elev-talones': 'Fortalece pantorrillas para el empuje constante en cada zancada.',
      'remo-barra': 'Fortalece espalda alta para mantener postura erguida al final de la carrera.',
    },
  },
  {
    id: 'tennis',
    name: 'Tenis',
    emoji: '🎾',
    attributes: [
      { id: 'explosive', name: 'Potencia Explosiva', emoji: '💥' },
      { id: 'lateral', name: 'Desplazamiento Lateral', emoji: '↔️' },
      { id: 'core', name: 'Rotación de Core', emoji: '🔄' },
      { id: 'endurance', name: 'Resistencia', emoji: '❤️' },
    ],
    exerciseBenefits: {
      'peso-muerto-rumano': 'Isquiotibiales fuertes para frenar y cambiar dirección en la pista.',
      'zancadas': 'Trabajo unilateral para llegar a bolas lejanas en posición baja.',
      'sentadilla-barra': 'Base de potencia para el saque y golpes potentes.',
      'remo-barra': 'Espalda fuerte para el movimiento de preparación del golpe.',
      'press-hombro-barra': 'Empuje hacia arriba para potencia del saque.',
      'plancha-lastre': 'Rotación de core controlada para golpes potentes y precisos.',
      'extension-triceps': 'Extensión del brazo en el saque y globos.',
      'curl-barra': 'Fortalece bíceps para control en el revés y golpes con efecto.',
      'ab-wheel': 'Core profundo para rotación explosiva en drives y reveses.',
      'elev-laterales': 'Fortalece manguito rotador para golpes de fondo repetitivos.',
    },
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    emoji: '💥',
    attributes: [
      { id: 'strength', name: 'Fuerza General', emoji: '💪' },
      { id: 'endurance', name: 'Resistencia Metabólica', emoji: '❤️' },
      { id: 'explosive', name: 'Potencia', emoji: '💥' },
      { id: 'core', name: 'Core', emoji: '🧊' },
    ],
    exerciseBenefits: {
      'sentadilla-barra': 'Base de todos los WODs con barra. Potencia y movilidad.',
      'peso-muerto': 'Cadena posterior completa para levantamientos olímpicos y WODs de fuerza.',
      'press-hombro-barra': 'Push press y jerk requieren esta base de hombro.',
      'remo-barra': 'Espalda para cleans y snatches.',
      'plancha-lastre': 'Core para todo: levantamientos, gimnásticos y WODs metabólicos.',
      'zancadas': 'Trabajo unilateral para skipping y lunges en WODs.',
    },
  },
  {
    id: 'general',
    name: 'General',
    emoji: '🏋️',
    attributes: [
      { id: 'strength', name: 'Fuerza', emoji: '💪' },
      { id: 'hypertrophy', name: 'Hipertrofia', emoji: '🔥' },
      { id: 'endurance', name: 'Resistencia', emoji: '❤️' },
    ],
    exerciseBenefits: {},
  },
]

const SPORT_MAP = Object.fromEntries(SPORTS.map(s => [s.id, s]))

export function getSport(id) {
  return SPORT_MAP[id] || SPORTS[0]
}

export function getSportAttributes(sportId) {
  const sport = getSport(sportId)
  return sport.attributes
}

export function getExerciseSportBenefit(exerciseId, sportId) {
  const sport = getSport(sportId)
  if (!sport.exerciseBenefits) return null
  return sport.exerciseBenefits[exerciseId] || null
}
