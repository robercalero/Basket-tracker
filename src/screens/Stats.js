import { $ } from '../utils/dom.js';
import { fmtDate } from '../utils/format.js';
import { dbGet } from '../services/storage.js';
import { renderChart } from '../components/Chart.js';
import { PLANS } from '../data/plans/index.js';

export async function renderStats() {
  const scr = $('stats');
  if (!scr) return;
  scr.innerHTML = '';

  const log = await dbGet('log', []);
  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || { name: 'Plan' };

  // Calculate stats
  const totalWorkouts = log.length;
  const totalExercises = log.reduce((s, l) => s + (l.ex ? l.ex.length : 0), 0);
  const totalSets = log.reduce((s, l) => s + (l.ex ? l.ex.reduce((ss, e) => ss + (e.s || 0), 0) : 0), 0);
  const totalDuration = log.reduce((s, l) => s + (l.dur || 0), 0);
  const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

  // Current streak
  let streak = 0;
  const streakNow = new Date();
  const off = streakNow.getTimezoneOffset();
  const todayLocal = new Date(streakNow.getTime() - off * 60000).toISOString().split('T')[0];
  const cursor = new Date(streakNow);
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().split('T')[0];
    if (log.find(l => l.d === key)) {
      if (key === todayLocal || streak > 0) streak++;
    } else if (i > 0) break;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Weekly comparison (handles Sunday correctly)
  const mondayOf = d => {
    const day = d.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    const m = new Date(d);
    m.setDate(d.getDate() + offset);
    m.setHours(0,0,0,0);
    return m;
  };
  const now = new Date();
  const startOfWeek = mondayOf(now);
  const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(endOfWeek.getDate() + 7);

  const thisWeek = log.filter(l => {
    const d = new Date(l.d + 'T12:00:00');
    return d >= startOfWeek && d < endOfWeek;
  }).length;

  const startOfLastWeek = new Date(startOfWeek); startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  const lastWeek = log.filter(l => {
    const d = new Date(l.d + 'T12:00:00');
    return d >= startOfLastWeek && d < startOfWeek;
  }).length;

  scr.innerHTML = `
    <div class="card">
      <div style="font-size:14px;font-weight:700;margin-bottom:4px">Estadísticas</div>
      <div style="font-size:12px;color:var(--tx2);margin-bottom:12px">${plan ? plan.name : 'Sin plan'} · ${totalWorkouts} entrenos</div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">${totalWorkouts}</div>
          <div class="stat-label">Entrenos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value gr">${totalExercises}</div>
          <div class="stat-label">Ejercicios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value ye">${totalSets}</div>
          <div class="stat-label">Series</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Math.floor(avgDuration / 60)}m</div>
          <div class="stat-label">Promedio</div>
        </div>
        <div class="stat-card">
          <div class="stat-value ${streak > 0 ? 'gr' : 're'}">${streak}</div>
          <div class="stat-label">Racha (días)</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${thisWeek}</div>
          <div class="stat-label">Esta semana</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Comparativa semanal</div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value ${thisWeek > lastWeek ? 'gr' : thisWeek < lastWeek ? 're' : 'ye'}">${thisWeek}</div>
          <div class="stat-label">Esta semana</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${lastWeek}</div>
          <div class="stat-label">Semana pasada</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Últimos entrenos</div>
      ${log.slice(-5).reverse().map(l => `
        <div style="padding:8px 0;display:flex;justify-content:space-between;border-bottom:1px solid var(--br);font-size:13px">
          <span>${fmtDate(l.d)}</span>
          <span style="color:var(--tx2)">${l.ex ? l.ex.length : 0} ejercicios · ${Math.floor((l.dur || 0) / 60)}m</span>
        </div>`).join('')}
    </div>`;

  // Exercise-specific progress
  const exMap = {};
  log.forEach(l => {
    (l.ex || []).forEach(e => {
      if (!exMap[e.n]) exMap[e.n] = [];
      exMap[e.n].push(e);
    });
  });

  const topExercises = Object.entries(exMap)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  if (topExercises.length > 0) {
    const exCard = document.createElement('div');
    exCard.className = 'card';
    exCard.innerHTML = `<div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Ejercicios principales</div>
      ${topExercises.map(([name, entries]) => {
        const lastW = entries[entries.length - 1]?.w || 0;
        const firstW = entries[0]?.w || 0;
        const change = lastW - firstW;
        const totalSets = entries.reduce((s, e) => s + (e.s || e.sets?.length || 0), 0);
        return `<div style="padding:8px 0;border-bottom:1px solid var(--br);font-size:13px">
          <div style="display:flex;justify-content:space-between">
            <strong>${name}</strong>
            <span style="color:${change > 0 ? 'var(--gr)' : change < 0 ? 'var(--re)' : 'var(--tx2)'}">
              ${change > 0 ? '+' : ''}${change} kg
            </span>
          </div>
          <div style="font-size:12px;color:var(--tx2);margin-top:2px">
            ${entries.length} sesiones · ${totalSets} series · última: ${lastW}kg
          </div>
        </div>`;
      }).join('')}
      <div style="margin-top:8px;text-align:center">
        <button class="btn btn-sm btn-ghost" onclick="window.goTab('progress')">Ver detalles →</button>
      </div>`;
    scr.appendChild(exCard);

    // Mini chart for top exercise
    setTimeout(() => {
      const topEx = topExercises[0];
      if (topEx) {
        const chartCard = document.createElement('div');
        chartCard.className = 'card';
        chartCard.innerHTML = `<div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Evolución: ${topEx[0]}</div>
          <div class="chart-wrap" style="height:120px"><canvas id="statsExChart"></canvas></div>`;
        scr.appendChild(chartCard);
        const data = topEx[1].map((e, i) => ({
          x: i,
          y: e.w || 0,
          label: e.d || '',
        })).filter(d => d.y > 0);
        if (data.length > 1) renderChart('statsExChart', topEx[0], 30, '#7C5CFC');
      }
    }, 50);
  }

  scr.classList.add('active');
}
