import { $ } from '../utils/dom.js';
import { SPORTS } from '../data/sports.js';

let editingPlan = null;

export async function renderPlanCreator() {
  const scr = $('planCreator');
  if (!scr) return;
  scr.innerHTML = '';

  const plan = editingPlan || getDefaultPlan();

  scr.innerHTML = `
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">${editingPlan ? 'Editar plan' : 'Crear plan personalizado'}</div>

      <div class="profile-field">
        <label>Nombre del plan</label>
        <input type="text" id="pcName" value="${plan.name}" placeholder="Ej: Mi rutina">
      </div>
      <div class="profile-field">
        <label>Descripción</label>
        <input type="text" id="pcDesc" value="${plan.desc || ''}" placeholder="Breve descripción">
      </div>

      <div style="display:flex;gap:8px">
        <div class="profile-field" style="flex:1">
          <label>Nivel</label>
          <select id="pcLevel">
            <option value="beginner" ${plan.level === 'beginner' ? 'selected' : ''}>Principiante</option>
            <option value="intermediate" ${(plan.level || 'intermediate') === 'intermediate' ? 'selected' : ''}>Intermedio</option>
            <option value="advanced" ${plan.level === 'advanced' ? 'selected' : ''}>Avanzado</option>
          </select>
        </div>
        <div class="profile-field" style="flex:1">
          <label>Objetivo</label>
          <select id="pcGoal">
            <option value="strength" ${plan.goal === 'strength' ? 'selected' : ''}>Fuerza</option>
            <option value="hypertrophy" ${(plan.goal || 'hypertrophy') === 'hypertrophy' ? 'selected' : ''}>Hipertrofia</option>
            <option value="endurance" ${plan.goal === 'endurance' ? 'selected' : ''}>Resistencia</option>
          </select>
        </div>
        <div class="profile-field" style="flex:1">
          <label>Deporte</label>
          <select id="pcSport">
            ${SPORTS.map(s => `<option value="${s.id}" ${(plan.recommendedSports && plan.recommendedSports[0] === s.id) ? 'selected' : s.id === 'general' ? 'selected' : ''}>${s.emoji} ${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="profile-field" style="flex:1">
          <label>Días/semana</label>
          <input type="number" id="pcDays" value="${plan.daysPerWeek || 3}" min="1" max="7">
        </div>
      </div>

      <div style="margin-top:12px">
        <div style="font-size:12px;color:var(--tx2);margin-bottom:8px">Días de entrenamiento</div>
        <div id="pcDaysList"></div>
        <button class="btn btn-sm btn-ghost" onclick="window.addDay()" style="margin-top:4px">+ Añadir día</button>
      </div>

      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-primary btn-block" onclick="window.saveCustomPlan()">Guardar plan</button>
        <button class="btn btn-ghost" onclick="window.cancelPlanEdit()">Cancelar</button>
      </div>
    </div>
  `;

  renderDays(plan);
  scr.classList.add('active');
}

function getDefaultPlan() {
  return {
    name: '',
    desc: '',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 3,
    recommendedSports: ['general'],
    weeks: [{
      label: 'Semana 1',
      phase: 'custom',
      days: [
        [{ name: 'Press Banca Plano', sets: 3, reps: '10', rir: 1, rest: 90 }],
        [{ name: 'Remo con Barra', sets: 3, reps: '10', rir: 1, rest: 90 }],
        [{ name: 'Sentadilla con Barra', sets: 3, reps: '10', rir: 1, rest: 120 }],
      ],
    }],
  };
}

function renderDays(plan) {
  const container = $('#pcDaysList');
  if (!container) return;
  const week = plan.weeks[0];
  if (!week) return;
  container.innerHTML = week.days.map((day, di) => `
    <div style="background:var(--sf);border-radius:8px;padding:8px 10px;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <strong style="font-size:13px">Día ${di + 1}</strong>
        <span style="cursor:pointer;color:var(--re);font-size:13px;opacity:0.6" onclick="window.removeDay(${di})">✕</span>
      </div>
      ${day.map((ex, ei) => `
        <div class="pc-ex-row" style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
          <input type="text" class="pc-ex-name" value="${ex.name}" placeholder="Ejercicio" style="flex:2;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px">
          <input type="text" class="pc-ex-sets" value="${ex.sets}" placeholder="Sets" style="width:40px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
          <input type="text" class="pc-ex-reps" value="${ex.reps}" placeholder="Reps" style="width:45px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
          <input type="text" class="pc-ex-rir" value="${ex.rir}" placeholder="RIR" style="width:35px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
          ${ei === day.length - 1 ? `<span style="cursor:pointer;color:var(--ac);font-size:12px" onclick="window.addExercise(${di})">+</span>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function collectPlanFromUI() {
  const name = document.getElementById('pcName')?.value?.trim();
  if (!name) { alert('El nombre del plan es obligatorio'); return null }

  const sport = document.getElementById('pcSport')?.value || 'general';
  const plan = {
    id: editingPlan?.id || 'custom_' + Date.now(),
    name,
    desc: document.getElementById('pcDesc')?.value?.trim() || '',
    emoji: '📋',
    level: document.getElementById('pcLevel')?.value || 'intermediate',
    goal: document.getElementById('pcGoal')?.value || 'hypertrophy',
    daysPerWeek: parseInt(document.getElementById('pcDays')?.value) || 3,
    recommendedSports: [sport],
    weeks: [{
      label: 'Semana 1',
      phase: 'custom',
      days: [],
    }],
  };

  const dayContainers = document.querySelectorAll('#pcDaysList > div');
  for (const dayEl of dayContainers) {
    const exRows = dayEl.querySelectorAll('.pc-ex-row');
    const day = [];
    for (const row of exRows) {
      const name = row.querySelector('.pc-ex-name')?.value?.trim();
      if (!name) continue;
      day.push({
        name,
        sets: parseInt(row.querySelector('.pc-ex-sets')?.value) || 3,
        reps: row.querySelector('.pc-ex-reps')?.value || '10',
        rir: parseInt(row.querySelector('.pc-ex-rir')?.value) || 1,
        rest: 90,
      });
    }
    if (day.length > 0) plan.weeks[0].days.push(day);
  }

  return plan;
}

window.addDay = function() {
  const daysContainer = document.getElementById('pcDaysList');
  if (daysContainer) {
    const div = document.createElement('div');
    div.style.cssText = 'background:var(--sf);border-radius:8px;padding:8px 10px;margin-bottom:8px';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <strong style="font-size:13px">Día ${daysContainer.children.length + 1}</strong>
        <span style="cursor:pointer;color:var(--re);font-size:13px;opacity:0.6" onclick="this.parentElement.parentElement.remove()">✕</span>
      </div>
      <div class="pc-ex-row" style="display:flex;gap:4px;align-items:center;margin-bottom:4px">
        <input type="text" class="pc-ex-name" placeholder="Ejercicio" style="flex:2;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px">
        <input type="text" class="pc-ex-sets" value="3" placeholder="Sets" style="width:40px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
        <input type="text" class="pc-ex-reps" value="10" placeholder="Reps" style="width:45px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
        <input type="text" class="pc-ex-rir" value="1" placeholder="RIR" style="width:35px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
        <span style="cursor:pointer;color:var(--ac);font-size:12px" onclick="window.addExercise(${daysContainer.children.length})">+</span>
      </div>`;
    daysContainer.appendChild(div);
  }
};

window.removeDay = function(di) {
  const daysContainer = document.getElementById('pcDaysList');
  const dayEl = daysContainer?.children[di];
  if (dayEl) dayEl.remove();
  // Renumber remaining days
  requestAnimationFrame(() => {
    Array.from(daysContainer?.children || []).forEach((el, i) => {
      const label = el.querySelector('strong');
      if (label) label.textContent = `Día ${i + 1}`;
    });
  });
};

window.addExercise = function(di) {
  const daysContainer = document.getElementById('pcDaysList');
  const dayEl = daysContainer?.children[di];
  if (!dayEl) return;
  const row = document.createElement('div');
  row.className = 'pc-ex-row';
  row.style.cssText = 'display:flex;gap:4px;align-items:center;margin-bottom:4px';
  row.innerHTML = `
    <input type="text" class="pc-ex-name" placeholder="Ejercicio" style="flex:2;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px">
    <input type="text" class="pc-ex-sets" value="3" placeholder="Sets" style="width:40px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
    <input type="text" class="pc-ex-reps" value="10" placeholder="Reps" style="width:45px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
    <input type="text" class="pc-ex-rir" value="1" placeholder="RIR" style="width:35px;padding:4px 6px;border-radius:6px;border:1px solid var(--br);background:var(--bg);color:var(--tx);font-size:12px;text-align:center">
    <span style="cursor:pointer;color:var(--ac);font-size:12px" onclick="window.addExercise(${di})">+</span>
  `;
  dayEl.querySelector('.pc-ex-row:last-child')?.after(row);
};

window.saveCustomPlan = async function() {
  const { saveCustomPlan: savePlan } = await import('../services/customPlans.js');
  const plan = collectPlanFromUI();
  if (!plan) return;
  await savePlan(plan);
  editingPlan = null;
  const { renderProfile } = await import('./Profile.js');
  await renderProfile();
  window.goTab('profile');
};

window.cancelPlanEdit = function() {
  editingPlan = null;
  window.goTab('profile');
};

export function startPlanCreator(editData) {
  editingPlan = editData || null;
  window.goTab('planCreator');
}
