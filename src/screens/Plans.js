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

let filterLevel = sessionStorage.getItem('planFilterLevel') || null;
let filterGoal = sessionStorage.getItem('planFilterGoal') || null;
let filterSport = sessionStorage.getItem('planFilterSport') || null;
let _initialFilterSet = filterSport !== null;

async function getDefaultSportFilter() {
  if (!_initialFilterSet) {
    const profile = await dbGet('profile', { sport: 'basketball' });
    filterSport = profile.sport || 'basketball';
    sessionStorage.setItem('planFilterSport', filterSport);
    _initialFilterSet = true;
  }
}

function persistFilters() {
  if (filterLevel) sessionStorage.setItem('planFilterLevel', filterLevel);
  else sessionStorage.removeItem('planFilterLevel');
  if (filterGoal) sessionStorage.setItem('planFilterGoal', filterGoal);
  else sessionStorage.removeItem('planFilterGoal');
  if (filterSport) sessionStorage.setItem('planFilterSport', filterSport);
  else sessionStorage.removeItem('planFilterSport');
}

function planMatchesSport(p, sportId) {
  if (!sportId) return true;
  return p.recommendedSports && (p.recommendedSports.includes(sportId) || p.recommendedSports.includes('general'));
}

export async function renderPlans() {
  const scr = $('plans');
  if (!scr) return;
  scr.innerHTML = '';

  await getDefaultSportFilter();

  const profile = await dbGet('profile', { sport: 'basketball' });
  const userSport = profile.sport || 'basketball';
  const userSportName = (SPORTS.find(s => s.id === userSport) || SPORTS[0]).name;

  const planIdx = await findActivePlanIdx();
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const activePlan = allPlans[planIdx] || PLANS[0];

  const filteredPlans = allPlans.filter(p => {
    if (filterLevel && p.level !== filterLevel) return false;
    if (filterGoal && p.goal !== filterGoal) return false;
    if (filterSport && !planMatchesSport(p, filterSport)) return false;
    return true;
  });

  const sportPlans = filteredPlans.filter(p => planMatchesSport(p, userSport));
  const otherPlans = filteredPlans.filter(p => !planMatchesSport(p, userSport));

  function renderPlanCard(p, compact) {
    const realIdx = allPlans.indexOf(p);
    const isActive = realIdx === planIdx;
    if (compact) {
      return `
        <div class="plan-card-sm ${isActive ? 'active' : ''}" onclick="window.selectPlan(${realIdx})">
          <span class="plan-emoji">${p.emoji || '📋'}</span>
          <div class="plan-name">${p.name}${p.custom ? '✨' : ''}</div>
          <div class="plan-badges">
            <span class="plan-badge">${LEVEL_NAMES[p.level] || p.level || 'int'}</span>
            <span class="plan-badge">${p.daysPerWeek || '?'}d</span>
          </div>
          ${isActive ? '<span class="active-tag">✓ ACTIVO</span>' : ''}
        </div>`;
    }
    return `
      <div class="plan-card ${isActive ? 'active' : ''}" onclick="window.selectPlan(${realIdx})" style="${isActive ? 'border-color:var(--ac)' : ''}">
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
          ${isActive ? '<span style="color:var(--ac);font-size:12px;font-weight:600">ACTIVO</span>' : ''}
          ${p.custom ? `<span style="cursor:pointer;color:var(--re);font-size:16px;opacity:0.6" onclick="event.stopPropagation();window.delCustPlan('${p.id}')">✕</span>` : ''}
        </div>
      </div>`;
  }

  scr.innerHTML = `
    <details class="filter-bar" ${(filterLevel || filterGoal) ? 'open' : ''}>
      <summary style="font-size:12px;color:var(--tx2);padding:8px 0;cursor:pointer;user-select:none">
        ${(filterLevel || filterGoal) ? '🔽' : '🔼'} Filtros
        ${filterLevel ? `<span style="margin-left:6px;font-size:10px;background:var(--cl);padding:2px 6px;border-radius:4px">${LEVEL_NAMES[filterLevel]}</span>` : ''}
        ${filterGoal ? `<span style="margin-left:6px;font-size:10px;background:var(--cl);padding:2px 6px;border-radius:4px">${GOAL_NAMES[filterGoal]}</span>` : ''}
        ${(filterLevel || filterGoal) ? '<span style="margin-left:6px;font-size:10px;color:var(--re);cursor:pointer" onclick="event.stopPropagation();window.clearFilters()">✕</span>' : ''}
      </summary>
      <div style="padding:8px 0 4px;display:flex;gap:6px;flex-wrap:wrap">
        ${LEVELS.map(l => `
          <span class="filter-chip" style="padding:3px 10px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:11px;cursor:pointer${filterLevel === l ? ' active' : ''}" onclick="window.toggleFilterLevel('${l}')">${LEVEL_NAMES[l]}</span>
        `).join('')}
      </div>
      <div style="padding:4px 0;display:flex;gap:6px;flex-wrap:wrap">
        ${GOALS.map(g => `
          <span class="filter-chip" style="padding:3px 10px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:11px;cursor:pointer${filterGoal === g ? ' active' : ''}" onclick="window.toggleFilterGoal('${g}')">${GOAL_NAMES[g]}</span>
        `).join('')}
      </div>
      <div style="padding:4px 0;display:flex;gap:6px;flex-wrap:wrap">
        ${SPORTS.map(s => `
          <span class="filter-chip" style="padding:3px 10px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:11px;cursor:pointer${filterSport === s.id ? ' active' : ''}" onclick="window.toggleFilterSport('${s.id}')">${s.emoji} ${s.name}</span>
        `).join('')}
      </div>
    </details>

    ${sportPlans.length > 0 ? `
    <div class="plan-section">
      <div class="plan-section-title">⭐ Recomendados para ${userSportName}</div>
      <div class="plan-hscroll">
        ${sportPlans.map(p => renderPlanCard(p, true)).join('')}
      </div>
    </div>` : ''}

    ${otherPlans.length > 0 ? `
    <div class="plan-section">
      <div class="plan-section-title">📋 Todos los planes${filteredPlans.length !== allPlans.length ? ` (${filteredPlans.length})` : ''}</div>
      <div class="plan-grid-2">
        ${otherPlans.map(p => renderPlanCard(p, true)).join('')}
      </div>
    </div>` : ''}

    ${filteredPlans.length === 0 ? '<div style="color:var(--tx3);font-size:13px;text-align:center;padding:24px">Ningún plan coincide con los filtros</div>' : ''}

    <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
      <button class="btn btn-ghost btn-block" onclick="window.startPlanCreator()" style="font-size:12px">+ Crear plan personalizado</button>
      <button class="btn btn-primary btn-block" onclick="window.showAIPlanGen()" style="font-size:12px">🤖 Generar Plan con IA</button>
    </div>

    <div id="aiPlanGen" style="display:none;margin-top:8px">
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
  persistFilters();
  renderPlans();
}

export function toggleFilterGoal(goal) {
  filterGoal = filterGoal === goal ? null : goal;
  persistFilters();
  renderPlans();
}

export async function toggleFilterSport(sport) {
  filterSport = filterSport === sport ? null : sport;
  persistFilters();
  renderPlans();
}

export function clearFilters() {
  filterLevel = null;
  filterGoal = null;
  persistFilters();
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
  status.textContent = 'Conectando con IA...';

  try {
    const resp = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport: profile.sport, goal, level, daysPerWeek: days }),
    });
    const data = await resp.json();
    const plan = data.plan;
    if (!plan || !plan.weeks || plan.weeks.length === 0) throw new Error('Plan inválido');

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
    // Fallback: use local generator if server fails
    try {
      status.textContent = 'Servidor no disponible, generando localmente...';
      const { generatePlan } = await import('../services/planGenerator.js');
      const plan = generatePlan({ sport: profile.sport, goal, level, daysPerWeek: days });
      const { saveCustomPlan } = await import('../services/customPlans.js');
      await saveCustomPlan(plan);
      await dbSet('customPlanId', plan.id);
      status.textContent = '✅ Plan generado localmente. Activándolo...';
      window.closeAIPlanGen();
      await renderPlans();
      const homeScr = document.getElementById('home');
      if (homeScr && homeScr.classList.contains('active')) {
        await renderHome();
      }
    } catch (fallbackErr) {
      status.textContent = '❌ Error: ' + fallbackErr.message;
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '🤖 Generar Plan';
  }
}
