import { EXERCISES, EXERCISE_MAP } from '../data/exercises/index.js'
import { getSport } from '../data/sports.js'

const REPS_BY_GOAL = {
  hypertrophy: { main: '8-12', secondary: '12-15', minSets: 3, maxSets: 4, rest: 90 },
  strength: { main: '4-6', secondary: '6-8', minSets: 4, maxSets: 5, rest: 150 },
  endurance: { main: '15-20', secondary: '20-25', minSets: 3, maxSets: 3, rest: 45 },
}

const LEVEL_MULTIPLIER = {
  beginner: { setsDelta: -1, exercisesPerDay: 5 },
  intermediate: { setsDelta: 0, exercisesPerDay: 7 },
  advanced: { setsDelta: 1, exercisesPerDay: 8 },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr, n) {
  const shuffled = shuffle(arr)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

function getSportExercises(sportId) {
  const sport = getSport(sportId)
  if (!sport || !sport.exerciseBenefits || Object.keys(sport.exerciseBenefits).length === 0) {
    return []
  }
  const benefitIds = Object.keys(sport.exerciseBenefits)
  return benefitIds.map(id => EXERCISE_MAP[id]).filter(Boolean)
}

function getDefaultExercisesByMuscle() {
  return {
    chest: ['press-banca-plano', 'press-banca-inclinado', 'aperturas-polea'],
    back: ['remo-barra', 'jalon-polea-alta', 'remo-mancuerna-1-mano'],
    shoulders: ['press-hombro-barra', 'elev-laterales', 'face-pull'],
    biceps: ['curl-barra', 'curl-martillo'],
    triceps: ['extension-triceps-polea', 'fondos-banco'],
    quads: ['sentadilla-barra', 'prensa-piernas', 'sentadilla-frontal'],
    hamstrings: ['peso-muerto-rumano', 'curl-femoral'],
    glutes: ['peso-muerto', 'hip-thrust', 'zancadas'],
    calves: ['elev-talones', 'elev-talones-sentado'],
    abs: ['plancha', 'ab-wheel', 'crunches'],
  }
}

function makeExercise(name, sets, reps, rest, rir = 1) {
  return { name, sets, reps, rir, rest }
}

function buildDay(exercises, goal, level) {
  const g = REPS_BY_GOAL[goal] || REPS_BY_GOAL.hypertrophy
  const lvl = LEVEL_MULTIPLIER[level] || LEVEL_MULTIPLIER.intermediate
  const sets = Math.max(g.minSets + lvl.setsDelta, 2)

  return exercises.map((ex, i) => {
    const exercise = typeof ex === 'string' ? EXERCISE_MAP[ex] : null
    const name = exercise ? exercise.name : (typeof ex === 'string' ? ex : ex.name)
    const reps = typeof ex === 'object' && ex.reps ? ex.reps : (i < 3 ? g.main : g.secondary)
    const rest = typeof ex === 'object' && ex.rest ? ex.rest : g.rest
    const rir = typeof ex === 'object' && ex.rir != null ? ex.rir : (i < 3 ? 1 : 0)
    return makeExercise(name, sets, reps, rest, rir)
  })
}

function distributeExercises(allExercises, daysPerWeek) {
  const upper = ['chest', 'shoulders', 'biceps', 'triceps']
  const lower = ['quads', 'hamstrings', 'glutes', 'calves']
  const push = ['chest', 'shoulders', 'triceps']
  const pull = ['back', 'biceps', 'abs']

  const byMuscle = {}
  for (const ex of allExercises) {
    const mg = ex.muscleGroup || 'other'
    if (!byMuscle[mg]) byMuscle[mg] = []
    byMuscle[mg].push(ex)
  }

  const defaults = getDefaultExercisesByMuscle()
  function getExForMuscle(mg, count = 1) {
    const pool = byMuscle[mg] || []
    const ids = pool.length > 0 ? pool.map(e => e.id) : (defaults[mg] || [])
    return pick(ids, count)
  }

  if (daysPerWeek === 2) {
    const upperExs = upper.flatMap(mg => getExForMuscle(mg, 2))
    const lowerExs = lower.flatMap(mg => getExForMuscle(mg, 2))
    return [
      [...upperExs],
      [...lowerExs, ...getExForMuscle('abs', 1)],
    ]
  }

  if (daysPerWeek === 3) {
    const compounds = ['quads', 'chest', 'back'].flatMap(mg => getExForMuscle(mg, 2))
    const accessories = ['shoulders', 'biceps', 'triceps', 'hamstrings', 'abs'].flatMap(mg => getExForMuscle(mg, 1))
    return [
      [...compounds.slice(0, 4), ...accessories.slice(0, 2)],
      [...compounds.slice(2, 6), ...accessories.slice(1, 4)],
      [...compounds.slice(0, 2), ...accessories.slice(2)],
    ]
  }

  if (daysPerWeek === 4) {
    const upper1 = ['chest', 'back', 'shoulders'].flatMap(mg => getExForMuscle(mg, 2))
    const lower1 = ['quads', 'hamstrings', 'glutes'].flatMap(mg => getExForMuscle(mg, 2))
    const upper2 = ['chest', 'back', 'triceps', 'biceps'].flatMap(mg => getExForMuscle(mg, 1))
    const lower2 = ['quads', 'hamstrings', 'calves', 'abs'].flatMap(mg => getExForMuscle(mg, 1))
    return [
      [...upper1.slice(0, 5)],
      [...lower1.slice(0, 4), ...getExForMuscle('calves', 1)],
      [...upper1.slice(2), ...upper2.slice(0, 2)],
      [...lower1.slice(1), ...lower2.slice(1)],
    ]
  }

  if (daysPerWeek === 5) {
    return [
      push.flatMap(mg => getExForMuscle(mg, 2)),
      pull.flatMap(mg => getExForMuscle(mg, 2)),
      lower.flatMap(mg => getExForMuscle(mg, 2)),
      ['shoulders'].flatMap(mg => getExForMuscle(mg, 3)),
      ['biceps', 'triceps', 'abs'].flatMap(mg => getExForMuscle(mg, 2)),
    ]
  }

  const pushExs = push.flatMap(mg => getExForMuscle(mg, 2))
  const pullExs = pull.flatMap(mg => getExForMuscle(mg, 2))
  const legsExs = lower.flatMap(mg => getExForMuscle(mg, 2))
  return [
    pushExs,
    pullExs,
    legsExs,
    pushExs.slice(1).concat(getExForMuscle('shoulders', 2)),
    pullExs.slice(1).concat(getExForMuscle('abs', 2)),
    legsExs.slice(0, 4).concat(getExForMuscle('calves', 1)),
  ]
}

export function generatePlan({ sport, goal, level, daysPerWeek }) {
  const sportObj = getSport(sport || 'general')
  const sportName = sportObj ? sportObj.name : 'General'

  const sportExercises = getSportExercises(sport || 'general')
  const allExercises = sportExercises.length > 0
    ? sportExercises
    : EXERCISES

  const exerciseDays = distributeExercises(allExercises, daysPerWeek || 3)

  const plan = {
    id: 'ai_' + Date.now(),
    name: `Plan ${sportName} ${goal ? goal.charAt(0).toUpperCase() + goal.slice(1) : ''}`,
    emoji: '🤖',
    desc: `Generado por IA para ${sportName}. Objetivo: ${goal || 'hipertrofia'}, Nivel: ${level || 'intermedio'}`,
    level: level || 'intermediate',
    goal: goal || 'hypertrophy',
    daysPerWeek: daysPerWeek || 3,
    recommendedSports: [sport || 'general'],
    weeks: [{
      label: 'Semana 1',
      phase: 'custom',
      days: exerciseDays.map(day => buildDay(day, goal || 'hypertrophy', level || 'intermediate')),
    }],
  }

  return plan
}
