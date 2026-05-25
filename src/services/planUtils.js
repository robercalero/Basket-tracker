import { dbGet, dbSet } from './storage.js'
import { PLANS } from '../data/plans/index.js'

async function getMergedPlans() {
  const custom = await dbGet('customPlans', [])
  return [...PLANS, ...custom.map(p => ({ ...p, custom: true }))]
}

export async function getPlan() {
  const plans = await getMergedPlans()
  const planIdx = await dbGet('planIdx', 0)
  return { planIdx, plan: plans[planIdx] || null }
}

export async function getCurrentWeek() {
  const plans = await getMergedPlans()
  const planIdx = await dbGet('planIdx', 0)
  const plan = plans[planIdx]
  if (!plan || !plan.weeks || plan.weeks.length === 0) return { weekIdx: 0, week: null }
  const weekIdx = await dbGet('planWeek_' + planIdx, 0)
  return {
    weekIdx: Math.min(weekIdx, plan.weeks.length - 1),
    week: plan.weeks[Math.min(weekIdx, plan.weeks.length - 1)],
    totalWeeks: plan.weeks.length,
  }
}

export async function advanceWeek(dir = 1) {
  const { planIdx, plan } = await getPlan()
  if (!plan || !plan.weeks) return false
  const current = await dbGet('planWeek_' + planIdx, 0)
  const next = current + dir
  if (next < 0 || next >= plan.weeks.length) return false
  await dbSet('planWeek_' + planIdx, next)
  return true
}

export async function resetPlanWeek() {
  const planIdx = await dbGet('planIdx', 0)
  await dbSet('planWeek_' + planIdx, 0)
}

export function getDayExercises(week, dayIdx) {
  if (!week || !week.days || !week.days[dayIdx]) return null
  return week.days[dayIdx]
}
