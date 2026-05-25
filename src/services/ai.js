import { dbGet } from './storage.js'
import { getCurrentWeek } from './planUtils.js'
import { findExerciseByName as findEx, getVariants as getExVariants } from '../data/exercises/index.js'
import { getSport, getExerciseSportBenefit } from '../data/sports.js'

const STALL_THRESHOLD = 3
const MIN_PROGRESS_PCT = 2.5
const MAX_VOLUME_BUMPS = 3

export function analyzeExercise(exLog, planExercise) {
  if (!exLog || !exLog.sets || exLog.sets.length < 2) return null

  const sets = exLog.sets
  const last = sets[sets.length - 1]
  const prev = sets[sets.length - 2]
  if (!last || !prev) return null

  const advice = { type: null, message: '', suggestion: null }

  const lastWeight = last.w
  const prevWeight = prev.w

  if (lastWeight > prevWeight) {
    const pct = ((lastWeight - prevWeight) / prevWeight) * 100
    if (pct >= MIN_PROGRESS_PCT) {
      advice.type = 'progression'
      advice.message = `Subiste ${lastWeight - prevWeight}kg (${pct.toFixed(1)}%) — buen progreso${last.r > prev.r ? ' con más reps también' : ''}`
      if (planExercise && last.r >= maxReps(planExercise.reps)) {
        advice.suggestion = `Próximo objetivo: subir a ${lastWeight + 1.25}kg`
      }
    }
  } else if (lastWeight === prevWeight && prevWeight > 0 && last.r >= prev.r) {
    const streak = countStreak(sets, 'w')
    if (streak >= STALL_THRESHOLD) {
      advice.type = 'stall'
      advice.message = `${streak} sesiones con el mismo peso. Considera subir 1.25-2.5kg`
      advice.suggestion = `Intenta ${lastWeight + 1.25}kg la próxima sesión`
    } else if (last.r > prev.r) {
      advice.type = 'rep_progression'
      advice.message = `Mismo peso pero ${last.r} reps (vs ${prev.r}) — buena densidad`
      if (last.r >= maxReps(planExercise ? planExercise.reps : '8-12')) {
        advice.suggestion = `Listo para subir a ${lastWeight + 1.25}kg`
      }
    }
  } else if (lastWeight < prevWeight) {
    advice.type = 'regression'
    advice.message = `Bajaste peso. ¿Lesión o fatiga acumulada?`
    if (streakDeload(sets, 2)) {
      advice.suggestion = 'Considera semana de descarga (reduce volumen 40-50%)'
    }
  }

  return advice
}

export function analyzeVolume(exLog, planExercise) {
  if (!exLog || !exLog.sets) return { type: 'no_data', message: 'Sin datos de volumen' }

  const sets = exLog.sets
  const totalVolume = sets.reduce((sum, s) => sum + s.w * (s.r || 0), 0)
  const avgVolume = totalVolume / sets.length

  if (sets.length < 3) return { type: 'too_few', message: 'Pocos sets para analizar volumen', avgVolume }

  const volumes = sets.map(s => s.w * (s.r || 0))
  const trend = volumes[volumes.length - 1] - volumes[0]
  const bumpCount = volumes.filter((v, i) => i > 0 && v > volumes[i - 1]).length

  if (trend > 0 && bumpCount >= MAX_VOLUME_BUMPS) {
    return {
      type: 'volume_increasing',
      message: 'Volumen semanal en aumento — buena tendencia',
      avgVolume,
      trend: 'up',
    }
  }

  if (trend < 0) {
    return {
      type: 'volume_decreasing',
      message: 'Volumen semanal en descenso. ¿Fatiga acumulada?',
      avgVolume,
      trend: 'down',
    }
  }

  return {
    type: 'volume_steady',
    message: 'Volumen estable. Considera incrementar carga progresivamente',
    avgVolume,
    trend: 'flat',
  }
}

export function suggestVariant(exName) {
  const ex = findEx(exName)
  if (!ex) return null

  const variants = getExVariants(ex.id).filter(v => v.id !== ex.id)
  if (variants.length === 0) return null

  const pick = variants[Math.floor(Math.random() * variants.length)]
  return {
    current: exName,
    suggested: pick.name,
    reason: `Variante de ${ex.muscleGroup}. Prueba ${pick.name}`,
    muscleGroup: ex.muscleGroup,
  }
}

export async function getSessionAdvice(log, planIdx, sportId) {
  if (!log || !log.ex || log.ex.length === 0) return []

  const sport = sportId ? getSport(sportId) : null
  const sportName = sport ? sport.name : null
  const adviceList = []

  for (const exLog of log.ex) {
    if (!exLog.sets || exLog.sets.length < 2) continue

    const planExercise = await findPlanExercise(exLog.n, planIdx)
    const exAdvice = analyzeExercise(exLog, planExercise)
    if (exAdvice) {
      const item = { exercise: exLog.n, ...exAdvice }
      // Add sport-specific transfer benefit
      if (sportId && sportId !== 'general') {
        const ex = findEx(exLog.n)
        if (ex) {
          const benefit = getExerciseSportBenefit(ex.id, sportId)
          if (benefit) {
            item.sportBenefit = benefit
            item.sportName = sportName
          }
        }
      }
      adviceList.push(item)
    }

    if (exAdvice && exAdvice.type === 'stall') {
      const variant = suggestVariant(exLog.n)
      if (variant) adviceList.push({ exercise: exLog.n, type: 'variant', ...variant })
    }
  }

  return adviceList
}

function countStreak(sets, field) {
  let streak = 1
  for (let i = sets.length - 1; i > 0; i--) {
    if (sets[i][field] === sets[i - 1][field]) streak++
    else break
  }
  return streak
}

function streakDeload(sets, minDropCount) {
  if (sets.length < minDropCount + 1) return false
  const last = sets[sets.length - 1]
  let drops = 0
  for (let i = sets.length - 2; i >= 0 && drops < minDropCount; i--) {
    if (sets[i].w > last.w) drops++
  }
  return drops >= minDropCount
}

function maxReps(repsStr) {
  if (!repsStr) return 12
  const parts = repsStr.split('-').map(Number)
  return parts[parts.length - 1] || 12
}

async function findPlanExercise(name, planIdx) {
  const { week } = await getCurrentWeek()
  if (!week || !week.days) return null
  for (const day of week.days) {
    const ex = day.find(e => e.name === name)
    if (ex) return ex
  }
  return null
}
