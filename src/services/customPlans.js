import { dbGet, dbSet, dbDel } from './storage.js';

const CUSTOM_PLANS_KEY = 'customPlans';

export async function getCustomPlans() {
  return await dbGet(CUSTOM_PLANS_KEY, []);
}

export async function saveCustomPlan(plan) {
  const plans = await getCustomPlans();
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = { ...plans[idx], ...plan };
  } else {
    plans.push({ ...plan, id: plan.id || 'custom_' + Date.now() });
  }
  await dbSet(CUSTOM_PLANS_KEY, plans);
  return plans;
}

export async function deleteCustomPlan(id) {
  const plans = await getCustomPlans();
  const filtered = plans.filter(p => p.id !== id);
  if (filtered.length === plans.length) return false;
  await dbSet(CUSTOM_PLANS_KEY, filtered);
  return true;
}

export async function getAllPlans() {
  const builtIn = await import('../data/plans/index.js');
  const custom = await getCustomPlans();
  const offset = builtIn.PLANS.length;
  return {
    plans: [...builtIn.PLANS, ...custom.map(p => ({ ...p, custom: true }))],
    builtInCount: builtIn.PLANS.length,
  };
}
