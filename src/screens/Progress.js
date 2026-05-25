import { $, div } from '../utils/dom.js';
import { dbGet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { renderChart } from '../components/Chart.js';
import { getSessionAdvice } from '../services/ai.js';

export async function renderProgress() {
  const scr = $('progress');
  if (!scr) return;
  scr.innerHTML = '';

  const log = await dbGet('log', []);
  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || PLANS[0];

  if (log.length === 0) {
    scr.innerHTML = `<div class="card text-center"><div style="font-size:40px;margin-bottom:8px">📈</div><div style="font-weight:700">Sin datos de progreso</div><p class="text-muted mt-8">Completa entrenamientos para ver tu evolución</p></div>`;
    scr.classList.add('active');
    return;
  }

  // AI Coaching section
  try {
    const todayLog = log.filter(l => l.ex?.length > 0).slice(-1)[0];
    if (todayLog) {
      const adviceList = await getSessionAdvice(todayLog, planIdx);
      if (adviceList.length > 0) {
        const coachCard = document.createElement('div');
        coachCard.className = 'card';
        coachCard.innerHTML = `<div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">🤖 Coach AI</div>
          ${adviceList.map(a => `<div style="padding:6px 0;font-size:13px;border-bottom:1px solid var(--br)">
            <strong>${a.exercise}:</strong> ${a.message}${a.suggestion ? `<br><span style="color:var(--ac);font-size:12px">💡 ${a.suggestion}</span>` : ''}
          </div>`).join('')}`;
        scr.appendChild(coachCard);
      }
    }
  } catch {}

  // Aggregate exercises across all logs
  const exMap = {};
  log.forEach(l => {
    (l.ex || []).forEach(e => {
      if (!exMap[e.n]) exMap[e.n] = [];
      exMap[e.n].push({ w: e.w || 0, r: e.r, d: l.d });
    });
  });

  const exerciseNames = Object.keys(exMap).sort();

  const header = div('card');
  header.innerHTML = `<div style="font-size:14px;font-weight:700">Progreso por ejercicio</div>
    <div style="font-size:12px;color:var(--tx2);margin-top:2px">${exerciseNames.length} ejercicios con datos</div>`;
  scr.appendChild(header);

  exerciseNames.forEach(exName => {
    const data = exMap[exName].filter(d => d.w > 0).sort((a, b) => a.d.localeCompare(b.d));
    const best = data.length > 0 ? Math.max(...data.map(d => d.w)) : 0;
    const recent = data.length > 0 ? data[data.length - 1].w : 0;

    const card = div('card prog-card');
    card.innerHTML = `
      <div class="prog-ex-name">
        <span>${exName}</span>
        <span class="prog-best">${best > 0 ? best + ' kg' : '-'}</span>
      </div>
      <div class="prog-bar-wrap">
        <div class="prog-bar" style="width:${best > 0 ? (recent / best) * 100 : 0}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span class="prog-recent">Último: ${recent > 0 ? recent + ' kg' : 'sin peso'}</span>
        <span class="prog-recent">${data.length} registros</span>
      </div>
      <div class="chart-wrap" style="height:120px;margin-top:8px">
        <canvas id="progChart_${exName.replace(/\s+/g, '_')}"></canvas>
      </div>`;
    scr.appendChild(card);

    // Render mini chart after DOM update
    setTimeout(() => {
      renderChart(`progChart_${exName.replace(/\s+/g, '_')}`, exName, 15, '#34D399');
    }, 50);
  });

  scr.classList.add('active');
}
