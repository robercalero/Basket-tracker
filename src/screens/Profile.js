import { $ } from '../utils/dom.js';
import { dbGet, dbSet, dbDel } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { renderHome } from './Home.js';
import { getCurrentWeek, advanceWeek } from '../services/planUtils.js';
import { SPORTS } from '../data/sports.js';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_NAMES = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };
const GOALS = ['hypertrophy', 'strength', 'endurance'];
const GOAL_NAMES = { hypertrophy: 'Hipertrofia', strength: 'Fuerza', endurance: 'Resistencia' };

let filterLevel = null;
let filterGoal = null;
let filterSport = null;

export async function renderProfile() {
  const scr = $('profile');
  if (!scr) return;
  scr.innerHTML = '';

  const profile = await dbGet('profile', { name: '', gender: 'male', dob: '', height: 175, sport: 'basketball' });
  const planIdx = await findActivePlanIdx();
  const weightLog = await dbGet('weightLog', []);
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || PLANS[0];
  const sport = SPORTS.find(s => s.id === profile.sport) || SPORTS[0];

  const filteredPlans = allPlans.filter(p => {
    if (filterLevel && p.level !== filterLevel) return false;
    if (filterGoal && p.goal !== filterGoal) return false;
    if (filterSport && p.recommendedSports && !p.recommendedSports.includes(filterSport) && !p.recommendedSports.includes('general')) return false;
    if (filterSport && !p.recommendedSports) return false;
    return true;
  });

  scr.innerHTML = `
    <div class="card text-center">
      <div class="profile-avatar">${profile.name ? profile.name[0].toUpperCase() : '?'}</div>
      <div style="font-size:18px;font-weight:700">${profile.name || 'Sin nombre'}</div>
      <div style="font-size:13px;color:var(--tx2)">${plan ? plan.name : 'Sin plan'}</div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Perfil</div>
      <div class="profile-field">
        <label>Nombre</label>
        <input type="text" id="profName" value="${profile.name || ''}" placeholder="Tu nombre" onchange="saveProfileField('name',this.value)">
      </div>
      <div class="profile-field">
        <label>Género</label>
        <select id="profGender" onchange="saveProfileField('gender',this.value)">
          <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>Hombre</option>
          <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>Mujer</option>
        </select>
      </div>
      <div class="profile-field">
        <label>Altura (cm)</label>
        <input type="number" id="profHeight" value="${profile.height || 175}" placeholder="175" onchange="saveProfileField('height',this.value)">
      </div>
      <div class="profile-field">
        <label>Deporte</label>
        <select id="profSport" onchange="saveProfileField('sport',this.value)">
          ${SPORTS.map(s => `<option value="${s.id}" ${profile.sport === s.id ? 'selected' : ''}>${s.emoji} ${s.name}</option>`).join('')}
        </select>
      </div>
      <div style="margin-top:8px;padding:8px 12px;background:var(--sf);border-radius:8px;font-size:12px;color:var(--tx2)">
        ${sport.emoji} <strong>${sport.name}</strong>
        <span style="margin-left:6px">${sport.attributes.map(a => a.emoji).join(' ')}</span>
        <div style="margin-top:4px;font-size:11px;opacity:0.7">El Coach AI adaptará sus recomendaciones a tu deporte</div>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Peso corporal</div>
      <div class="weight-input-wrap">
        <input type="number" id="weightInput" step="0.1" placeholder="kg" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:15px">
        <button class="btn btn-sm btn-primary" onclick="saveCurrentWeight()">Guardar</button>
      </div>
      <div class="weight-history" id="weightHistory">
        ${weightLog.slice(-10).reverse().map(w => `
          <div class="weight-entry">
            <span>${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
            <span>${w.w} kg</span>
          </div>`).join('')}
        ${weightLog.length === 0 ? '<div style="color:var(--tx3);font-size:13px;text-align:center;padding:12px">Sin registros de peso</div>' : ''}
      </div>
      ${weightLog.length > 1 ? `<div class="chart-wrap" style="height:120px;margin-top:8px"><canvas id="weightChart"></canvas></div>` : ''}
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Plan de entrenamiento</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%">Filtrar por nivel:</span>
        ${LEVELS.map(l => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterLevel === l ? ' active' : ''}" onclick="window.toggleFilterLevel('${l}')">${LEVEL_NAMES[l]}</span>
        `).join('')}
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%;margin-top:4px">Filtrar por objetivo:</span>
        ${GOALS.map(g => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterGoal === g ? ' active' : ''}" onclick="window.toggleFilterGoal('${g}')">${GOAL_NAMES[g]}</span>
        `).join('')}
        <span style="font-size:11px;color:var(--tx3);padding:4px 0;width:100%;margin-top:4px">Filtrar por deporte:</span>
        ${SPORTS.map(s => `
          <span class="filter-chip" style="padding:4px 12px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:12px;cursor:pointer${filterSport === s.id ? ' active' : ''}" onclick="window.toggleFilterSport('${s.id}')">${s.emoji} ${s.name}</span>
        `).join('')}
        ${(filterLevel || filterGoal || filterSport) ? '<span style="padding:4px 12px;border-radius:6px;background:transparent;border:1px solid var(--re);font-size:11px;cursor:pointer;color:var(--re)" onclick="window.clearFilters()">✕ Limpiar filtros</span>' : ''}
      </div>
      <div id="aiPlanGen" style="display:none;margin:12px 0;padding:12px;background:var(--sf);border-radius:10px;border:1px solid var(--ac)">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px">🤖 Generar Plan con IA</div>
        <div class="profile-field">
          <label>Objetivo</label>
          <select id="aiGoal">
            <option value="hypertrophy" ${(filterGoal || 'hypertrophy') === 'hypertrophy' ? 'selected' : ''}>Hipertrofia</option>
            <option value="strength" ${filterGoal === 'strength' ? 'selected' : ''}>Fuerza</option>
            <option value="endurance" ${filterGoal === 'endurance' ? 'selected' : ''}>Resistencia</option>
          </select>
        </div>
        <div class="profile-field">
          <label>Nivel</label>
          <select id="aiLevel">
            <option value="beginner" ${(filterLevel || 'intermediate') === 'beginner' ? 'selected' : ''}>Principiante</option>
            <option value="intermediate" ${(filterLevel || 'intermediate') === 'intermediate' ? 'selected' : ''}>Intermedio</option>
            <option value="advanced" ${filterLevel === 'advanced' ? 'selected' : ''}>Avanzado</option>
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
      <button class="btn btn-sm btn-ghost btn-block" onclick="window.startPlanCreator()" style="margin-top:8px;font-size:12px">+ Crear plan personalizado</button>
      <button class="btn btn-sm btn-primary btn-block" onclick="window.showAIPlanGen()" style="margin-top:4px;font-size:12px">🤖 Generar Plan con IA</button>
    </div>`;

  if (plan && plan.weeks && plan.weeks.length > 1) {
    const weekCard = document.createElement('div');
    weekCard.className = 'card';
    const w = await getCurrentWeek();
    weekCard.innerHTML = `
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Progresión del plan</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div>
          <div style="font-weight:600;font-size:14px">Semana ${w.weekIdx + 1} / ${w.totalWeeks}</div>
          <div style="font-size:12px;color:var(--tx2)">${w.week?.label || ''}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm ${w.weekIdx === 0 ? 'btn-ghost' : 'btn-primary'}" onclick="window.advanceWeek(-1)" ${w.weekIdx === 0 ? 'disabled style="opacity:0.4"' : ''}>◀ Anterior</button>
          <button class="btn btn-sm ${w.weekIdx >= w.totalWeeks - 1 ? 'btn-ghost' : 'btn-primary'}" onclick="window.advanceWeek(1)" ${w.weekIdx >= w.totalWeeks - 1 ? 'disabled style="opacity:0.4"' : ''}>Siguiente ▶</button>
        </div>
      </div>`;
    scr.insertBefore(weekCard, scr.lastChild);
  }

  const dataCard = document.createElement('div');
  dataCard.className = 'card';
  dataCard.innerHTML = `
    <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Datos</div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm btn-ghost" style="flex:1" onclick="window.exportData()">📤 Exportar</button>
      <button class="btn btn-sm btn-ghost" style="flex:1" onclick="window.importData()">📥 Importar</button>
      <button class="btn btn-sm btn-ghost" style="flex:1;color:var(--re)" onclick="window.clearAllData()">🗑️ Limpiar</button>
    </div>
  `;
  scr.appendChild(dataCard);

  const installCard = document.createElement('div');
  installCard.className = 'card text-center';
  installCard.innerHTML = `
    <button class="btn btn-ghost btn-block" id="installBtn" style="display:none" onclick="window.installApp()">
      📲 Instalar app
    </button>`;
  scr.appendChild(installCard);

  scr.classList.add('active');
  const installBtn = document.getElementById('installBtn');
  if (installBtn && window.__deferredPrompt) installBtn.style.display = 'inline-flex';

  if (weightLog.length > 1) {
    setTimeout(() => renderWeightChart(weightLog), 100);
  }
}

export async function saveProfileField(field, value) {
  const profile = await dbGet('profile', { name: '', gender: 'male', dob: '', height: 175, sport: 'basketball' });
  profile[field] = value;
  if (field === 'height') profile[field] = parseFloat(value) || 175;
  if (field === 'sport') filterSport = value;
  await dbSet('profile', profile);
  renderProfile();
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
  await renderProfile();
  const homeScr = document.getElementById('home');
  if (homeScr && homeScr.classList.contains('active')) {
    await renderHome();
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

export async function saveCurrentWeight() {
  const input = $('weightInput');
  if (!input || !input.value) return;
  const w = parseFloat(input.value);
  if (!w || w <= 0) return;
  const weightLog = await dbGet('weightLog', []);
  weightLog.push({ d: new Date().toISOString().split('T')[0], w });
  await dbSet('weightLog', weightLog);
  input.value = '';
  renderProfile();
}

export function toggleFilterLevel(level) {
  filterLevel = filterLevel === level ? null : level;
  renderProfile();
}

window.showAIPlanGen = function() {
  const gen = document.getElementById('aiPlanGen');
  if (gen) gen.style.display = 'block';
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
    await renderProfile();
    const homeScr = document.getElementById('home');
    if (homeScr && homeScr.classList.contains('active')) {
      const { renderHome } = await import('./Home.js');
      await renderHome();
    }
  } catch (err) {
    status.textContent = '❌ Error: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = '🤖 Generar Plan';
    window.closeAIPlanGen();
  }
}

window.toggleFilterSport = function(sport) {
  filterSport = filterSport === sport ? null : sport;
  renderProfile();
}

export function toggleFilterGoal(goal) {
  filterGoal = filterGoal === goal ? null : goal;
  renderProfile();
}

export function clearFilters() {
  filterLevel = null;
  filterGoal = null;
  filterSport = null;
  renderProfile();
}

function renderWeightChart(weightLog) {
  const canvas = document.getElementById('weightChart');
  if (!canvas) return;
  const data = weightLog.slice(-20);
  if (data.length < 2) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;

  ctx.clearRect(0, 0, w, h);

  const maxW = Math.max(...data.map(d => d.w));
  const minW = Math.min(...data.map(d => d.w));
  const pad = 8;

  data.forEach((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.w - minW) / (Math.max(maxW - minW, 1))) * (h - pad * 2);
    if (i === 0) ctx.beginPath(), ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = '#7C5CFC';
  ctx.lineWidth = 2;
  ctx.stroke();
}
