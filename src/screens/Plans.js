import { $ } from '../utils/dom.js';
import { dbGet, dbSet, dbDel } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { getCurrentWeek } from '../services/planUtils.js';
import { SPORTS } from '../data/sports.js';
import { renderHome } from './Home.js';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_NAMES = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };
const GOALS = ['hypertrophy', 'strength', 'endurance'];
const GOAL_NAMES = { hypertrophy: 'Hipertrofia', strength: 'Fuerza', endurance: 'Resistencia' };

let filterLevel = null;
let filterGoal = null;
let filterSport = null;

export async function renderPlans() {
  const scr = $('plans');
  if (!scr) return;
  scr.innerHTML = '';

  const planIdx = await findActivePlanIdx();
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || PLANS[0];

  const filteredPlans = allPlans.filter(p => {
    if (filterLevel && p.level !== filterLevel) return false;
    if (filterGoal && p.goal !== filterGoal) return false;
    if (filterSport && p.recommendedSports && !p.recommendedSports.includes(filterSport) && !p.recommendedSports.includes('general')) return false;
    if (filterSport && !p.recommendedSports) return false;
    return true;
  });

  scr.innerHTML = `
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Filtros</div>
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%">Nivel:</span>
        ${LEVELS.map(l => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterLevel === l ? ' active' : ''}" onclick="window.toggleFilterLevel('${l}')">${LEVEL_NAMES[l]}</span>
        `).join('')}
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap">
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%">Objetivo:</span>
        ${GOALS.map(g => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterGoal === g ? ' active' : ''}" onclick="window.toggleFilterGoal('${g}')">${GOAL_NAMES[g]}</span>
        `).join('')}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%">Deporte:</span>
        ${SPORTS.map(s => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterSport === s.id ? ' active' : ''}" onclick="window.toggleFilterSport('${s.id}')">${s.emoji} ${s.name}</span>
        `).join('')}
      </div>
      ${(filterLevel || filterGoal || filterSport) ? '<div style="margin-top:8px"><span style="padding:4px 12px;border-radius:6px;background:transparent;border:1px solid var(--re);font-size:11px;cursor:pointer;color:var(--re)" onclick="window.clearFilters()">✕ Limpiar filtros</span></div>' : ''}
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
        Planes ${filteredPlans.length !== allPlans.length ? `<span style="font-size:11px;color:var(--tx3)">(${filteredPlans.length}/${allPlans.length})</span>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${filteredPlans.map((p, i) => {
          const realIdx = allPlans.indexOf(p);
          return `
          <div class="plan-card ${realIdx === planIdx ? 'active' : ''}" onclick="selectPlan(${realIdx})" style="${realIdx === planIdx ? 'border-color:var(--ac)' : ''}">
            <span class="plan-emoji">${p.emoji || '📋'}</span>
            <div class="plan-info">
              <div class="plan-name">${p.name}${p.custom ? ' <span style="font-size:10px;background:var(--ac);padding:1px 5px;border-radius:4px;color:#fff">custom</span>' : ''}</div>
              <div class="plan-desc">${p.desc || ''}</div>
              <div style="display:flex;gap:6px;margin-top:4px">
                <span style="font-size:10px;background:var(--cl);padding:2px 6px;border-radius:4px;color:var(--tx2)">${LEVEL_NAMES[p.level] || p.level || 'intermediate'}</span>
                <span style="font-size:10px;background:var(--cl);padding:2px 6px;border-radius:4px;color:var(--tx2)">${GOAL_NAMES[p.goal] || p.goal || 'hypertrophy'}</span>
                <span style="font-size:10px;background:var(--cl);padding:2px 6px;border-radius:4px;color:var(--tx2)">${p.daysPerWeek || '?'}d/sem</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              ${realIdx === planIdx ? '<span style="color:var(--ac);font-size:12px;font-weight:600">ACTIVO</span>' : ''}
              ${p.custom ? `<span style="cursor:pointer;color:var(--re);font-size:16px;opacity:0.6" onclick="event.stopPropagation();window.delCustPlan('${p.id}')">✕</span>` : ''}
            </div>
          </div>`;
        }).join('')}
        ${filteredPlans.length === 0 ? '<div style="color:var(--tx3);font-size:13px;text-align:center;padding:12px">Ningún plan coincide con los filtros</div>' : ''}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-ghost btn-block" onclick="window.startPlanCreator()" style="font-size:13px">+ Crear plan personalizado</button>
      <button class="btn btn-primary btn-block" onclick="window.showAIPlanGen()" style="font-size:13px">🤖 Generar Plan con IA</button>
    </div>

    <div id="aiPlanGen" style="display:none">
      <div class="card" style="border-color:var(--ac)">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px">🤖 Generar Plan con IA</div>
        <div class="profile-field">
          <label>Objetivo</label>
          <select id="aiGoal">
            <option value="hypertrophy">Hipertrofia</option>
            <option value="strength">Fuerza</option>
            <option value="endurance">Resistencia</option>
          </select>
        </div>
        <div class="profile-field">
          <label>Nivel</label>
          <select id="aiLevel">
            <option value="beginner">Principiante</option>
            <option value="intermediate" selected>Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
        <div class="profile-field">
          <label>Días / semana</label>
          <select id="aiDays">
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary btn-block" onclick="window.generateAIPlan()" id="aiGenBtn">🤖 Generar Plan</button>
          <button class="btn btn-ghost" onclick="window.closeAIPlanGen()">Cancelar</button>
        </div>
        <div id="aiGenStatus" style="font-size:12px;color:var(--tx2);margin-top:6px"></div>
      </div>
    </div>

    <div style="height:12px"></div>`;
  scr.classList.add('active');
}

export async function selectPlan(idx) {
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[idx];
  if (!plan) return;
  await dbSet('planIdx', idx);
  if (plan.custom) {
    await dbSet('customPlanId', plan.id);
  } else {
    await dbDel('customPlanId');
  }
  await renderPlans();
  const homeScr = document.getElementById('home');
  if (homeScr && homeScr.classList.contains('active')) {
    await renderHome();
  }
  const profileScr = document.getElementById('profile');
  if (profileScr && profileScr.classList.contains('active')) {
    const { renderProfile } = await import('./Profile.js');
    await renderProfile();
  }
}

export async function findActivePlanIdx() {
  const customPlanId = await dbGet('customPlanId', null);
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  if (customPlanId) {
    const idx = allPlans.findIndex(p => p.id === customPlanId);
    if (idx >= 0) return idx;
  }
  return await dbGet('planIdx', 0);
}

export function toggleFilterLevel(level) {
  filterLevel = filterLevel === level ? null : level;
  renderPlans();
}

export function toggleFilterGoal(goal) {
  filterGoal = filterGoal === goal ? null : goal;
  renderPlans();
}

export async function toggleFilterSport(sport) {
  filterSport = filterSport === sport ? null : sport;
  renderPlans();
}

export function clearFilters() {
  filterLevel = null;
  filterGoal = null;
  filterSport = null;
  renderPlans();
}

window.showAIPlanGen = function() {
  const gen = document.getElementById('aiPlanGen');
  if (gen) gen.style.display = 'block';
  gen?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.closeAIPlanGen = function() {
  const gen = document.getElementById('aiPlanGen');
  if (gen) gen.style.display = 'none';
  const status = document.getElementById('aiGenStatus');
  if (status) status.textContent = '';
}

window.generateAIPlan = async function() {
  const profile = await dbGet('profile', { name: '', sport: 'basketball' });
  const goal = document.getElementById('aiGoal')?.value || 'hypertrophy';
  const level = document.getElementById('aiLevel')?.value || 'intermediate';
  const days = parseInt(document.getElementById('aiDays')?.value) || 3;
  const btn = document.getElementById('aiGenBtn');
  const status = document.getElementById('aiGenStatus');

  if (!btn || !status) return;
  btn.disabled = true;
  btn.textContent = 'Generando...';
  status.textContent = 'Generando plan...';

  try {
    const { generatePlan } = await import('../services/planGenerator.js');
    const plan = generatePlan({ sport: profile.sport, goal, level, daysPerWeek: days });
    const { saveCustomPlan } = await import('../services/customPlans.js');
    await saveCustomPlan(plan);
    await dbSet('customPlanId', plan.id);
    status.textContent = '✅ Plan generado. Activándolo...';
    window.closeAIPlanGen();
    await renderPlans();
    const homeScr = document.getElementById('home');
    if (homeScr && homeScr.classList.contains('active')) {
      await renderHome();
    }
  } catch (err) {
    status.textContent = '❌ Error: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = '🤖 Generar Plan';
  }
}
