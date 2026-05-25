import { $, div } from '../utils/dom.js';
import { todayKey, getTodayIdx, fmtDate } from '../utils/format.js';
import { dbGet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { getCurrentWeek } from '../services/planUtils.js';

function getPlanByIdx(planIdx, customPlans) {
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  return allPlans[planIdx] || PLANS[0];
}

export async function renderHome() {
  const scr = $('home');
  if (!scr) return;
  scr.innerHTML = '';

  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const planIdx = await dbGet('planIdx', 0);
  const plan = getPlanByIdx(planIdx, customPlans);

  const { week } = await getCurrentWeek();
  const todayPlanDay = week ? week.days[getTodayIdx()] : null;

  // Header
  const header = div('card');
  const now = new Date();
  header.innerHTML = `
    <div style="text-align:center;padding:8px 0">
      <div style="font-size:32px;margin-bottom:4px">💪</div>
      <div style="font-size:20px;font-weight:800">BasketTracker</div>
      <div style="font-size:13px;color:var(--tx2);margin-top:2px">${now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>`;
  scr.appendChild(header);

  // Today's workout
  if (todayPlanDay) {
    const todayCard = div('card');
    const planLabel = plan.name || 'Plan';
    todayCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px">Entrenamiento de hoy</div>
          <div style="font-weight:700;font-size:16px;margin-top:2px">${planLabel}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.goTab('session',this)">Comenzar</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${todayPlanDay.map((ex, i) => `<span style="padding:4px 10px;border-radius:6px;background:var(--sf);font-size:12px;border:1px solid var(--br)">${ex.name}</span>`).join('')}
      </div>`;
    scr.appendChild(todayCard);
  }

  // Week overview
  const logs = await dbGet('log', []);
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const dayLog = logs.find(l => l.d === key);
    weekDays.push({ key, dow: d.toLocaleDateString('es-ES', { weekday: 'short' }), day: d.getDate(), hasData: !!dayLog, isToday: i === 0 });
  }

  const weekCard = div('card');
  weekCard.innerHTML = `
    <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Vista semanal</div>
    <div class="week-grid">
      ${weekDays.map(w => `
        <div class="week-day${w.isToday ? ' today' : ''}${w.hasData ? ' has-data' : ''}" onclick="window.goTab('history',this)">
          <div class="wd-dow">${w.dow}</div>
          <div class="wd-date">${w.day}</div>
          <div class="wd-dot${w.hasData ? ' done' : ''}"></div>
        </div>`).join('')}
    </div>`;
  scr.appendChild(weekCard);

  // Quick stats
  const totalWorkouts = logs.length;
  const totalExercises = logs.reduce((s, l) => s + (l.ex ? l.ex.length : 0), 0);
  const statsCard = div('card');
  statsCard.innerHTML = `
    <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Resumen</div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">${totalWorkouts}</div>
        <div class="stat-label">Entrenos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value gr">${totalExercises}</div>
        <div class="stat-label">Ejercicios</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;margin-top:8px">
      <button class="btn btn-sm btn-ghost" style="flex:1;font-size:12px" onclick="window.goTab('planView')">📋 Plan</button>
      <button class="btn btn-sm btn-ghost" style="flex:1;font-size:12px" onclick="window.goTab('exercises')">🏋️ Ejercicios</button>
    </div>`;
  scr.appendChild(statsCard);

  scr.classList.add('active');
}
