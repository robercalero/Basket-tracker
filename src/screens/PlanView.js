import { $ } from '../utils/dom.js';
import { dbGet } from '../services/storage.js';
import { getCurrentWeek } from '../services/planUtils.js';

export async function renderPlanView() {
  const scr = $('planView');
  if (!scr) return;
  scr.innerHTML = '';

  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...(await import('../data/plans/index.js')).PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx];
  if (!plan) {
    scr.innerHTML = '<div class="card text-center"><p>Selecciona un plan en Perfil</p></div>';
    scr.classList.add('active');
    return;
  }

  const w = await getCurrentWeek();
  const week = w.week;
  if (!week) {
    scr.innerHTML = '<div class="card text-center"><p>Este plan no tiene semanas definidas</p></div>';
    scr.classList.add('active');
    return;
  }

  scr.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:24px">${plan.emoji || '📋'}</span>
        <div>
          <div style="font-size:18px;font-weight:700">${plan.name}</div>
          <div style="font-size:12px;color:var(--tx2)">${plan.level === 'beginner' ? 'Principiante' : plan.level === 'intermediate' ? 'Intermedio' : 'Avanzado'} · ${plan.goal === 'strength' ? 'Fuerza' : plan.goal === 'hypertrophy' ? 'Hipertrofia' : 'Resistencia'} · ${plan.daysPerWeek}d/sem</div>
        </div>
      </div>
    </div>

    ${plan.weeks.length > 1 ? `
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px">Semana ${w.weekIdx + 1} de ${w.totalWeeks}</span>
        <span style="font-size:12px;color:var(--ac);font-weight:600">${week.label || ''}</span>
      </div>
      <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">
        ${plan.weeks.map((_, i) => `
          <span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;cursor:pointer;${i === w.weekIdx ? 'background:var(--ac);color:#fff' : 'background:var(--cl);color:var(--tx2)'}" onclick="window.goToWeek(${i})">${i + 1}</span>
        `).join('')}
      </div>
    </div>` : ''}

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Días de entrenamiento</div>
    </div>`;

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  week.days.forEach((day, di) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'card';
    const dayName = dayNames[di] || `Día ${di + 1}`;
    const todayDayIdx = new Date().getDay();
    const isToday = (di + 1) % 7 === todayDayIdx;

    dayCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-weight:600;font-size:14px">${dayName}${isToday ? ' <span style="font-size:10px;background:var(--ac);color:#fff;padding:2px 8px;border-radius:10px">HOY</span>' : ''}</span>
        <span style="font-size:12px;color:var(--tx2)">${day.length} ejercicios</span>
      </div>
      ${day.map(ex => `
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--br);font-size:13px">
          <span>${ex.name}</span>
          <span style="color:var(--tx2);font-size:12px">${ex.sets}×${ex.reps} · ${ex.rir} RIR</span>
        </div>`).join('')}`;
    scr.appendChild(dayCard);
  });

  scr.classList.add('active');
}
