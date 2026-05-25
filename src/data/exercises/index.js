import { chest } from './chest.js'
import { back } from './back.js'
import { shoulders } from './shoulders.js'
import { arms } from './arms.js'
import { legs } from './legs.js'
import { abs } from './abs.js'
export { MUSCLE_GROUPS, EQUIPMENT_TYPES, EXERCISE_LEVELS } from './types.js'

const ALL = [...chest, ...back, ...shoulders, ...arms, ...legs, ...abs]

export const EXERCISES = ALL

export const EXERCISE_MAP = Object.fromEntries(ALL.map(e => [e.id, e]))

export function getExercise(id) {
  return EXERCISE_MAP[id] || null
}

export function getExercisesByMuscle(muscleGroup) {
  return ALL.filter(e => e.muscleGroup === muscleGroup)
}

export function getExercisesByEquipment(equipment) {
  return ALL.filter(e => e.equipment === equipment)
}

export function getVariantGroup(variantGroup) {
  return ALL.filter(e => e.variantGroup === variantGroup)
}

export function getVariants(exerciseId) {
  const ex = getExercise(exerciseId)
  if (!ex || !ex.variants) return []
  return ex.variants.map(id => getExercise(id)).filter(Boolean)
}

export function searchExercises(query) {
  const q = query.toLowerCase()
  return ALL.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.muscleGroup.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q)
  )
}

export function findExerciseByName(name) {
  if (!name) return null
  const q = name.toLowerCase().trim()
  return ALL.find(e => e.name.toLowerCase() === q) || null
}

let _byMuscleCache = null
export function getExercisesGroupedByMuscle() {
  if (_byMuscleCache) return _byMuscleCache
  const map = {}
  for (const e of ALL) {
    if (!map[e.muscleGroup]) map[e.muscleGroup] = []
    map[e.muscleGroup].push(e)
  }
  _byMuscleCache = map
  return map
}
