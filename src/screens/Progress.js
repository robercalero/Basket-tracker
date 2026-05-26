import { $, div } from '../utils/dom.js';
import { dbGet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { renderChart } from '../components/Chart.js';
import { getSessionAdvice } from '../services/ai.js';
import { SPORTS, getSportAttributes } from '../data/sports.js';

export async function renderProgress() {
  const scr = $('progress');
  if (!scr) return;
  scr.innerHTML = '';

  const log = await dbGet('log', []);
  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || PLANS[0];
  const profile = await dbGet('profile', { sport: 'basketball' });
  const sportId = profile.sport || 'basketball';
  const sport = SPORTS.find(s => s.id === sportId) || SPORTS[0];
  const attrs = getSportAttributes(sportId);

  if (log.length === 0) {
    scr.innerHTML = `<div class="card text-center"><div style="font-size:40px;margin-bottom:8px">📈</div><div style="font-weight:700">Sin datos de progreso</div><p class="text-muted mt-8">Completa entrenamientos para ver tu evolución</p></div>`;
    scr.classList.add('active');
    return;
  }

  // Sport attributes header card
  const sportCard = div('card');
  sportCard.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span style="font-size:28px">${sport.emoji}</span>
      <div>
        <div style="font-weight:700;font-size:16px">${sport.name}</div>
        <div style="font-size:11px;color:var(--tx2)">Atributos clave del deporte</div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${attrs.map(a => `
        <span style="padding:4px 10px;border-radius:6px;background:var(--sf);border:1px solid var(--br);font-size:11px">
          ${a.emoji} ${a.name}
        </span>
      `).join('')}
    </div>`;
  scr.appendChild(sportCard);

  // AI Coaching section with sport transfer advice
  try {
    const todayLog = log.filter(l => l.ex?.length > 0).slice(-1)[0];
    if (todayLog) {
      const adviceList = await getSessionAdvice(todayLog, planIdx, sportId);
      if (adviceList.length > 0) {
        const coachCard = document.createElement('div');
        coachCard.className = 'card';
        coachCard.innerHTML = `<div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">🤖 Coach AI — ${sport.emoji} ${sport.name}</div>
          ${adviceList.map(a => {
            let html = `<div style="padding:8px 0;border-bottom:1px solid var(--br)">
              <strong>${a.exercise}:</strong> ${a.message}`;
            if (a.sportBenefit && a.sportName) {
              html += `<br><span style="color:var(--gr);font-size:12px">🏀 Transferencia a ${a.sportName}: ${a.sportBenefit}</span>`;
            }
            if (a.suggestion) {
              html += `<br><span style="color:var(--ac);font-size:12px">💡 ${a.suggestion}</span>`;
            }
            if (a.type === 'variant') {
              html = `<div style="padding:8px 0;border-bottom:1px solid var(--br)">
                <span style="font-size:11px;background:var(--cl);padding:2px 6px;border-radius:4px;color:var(--tx2);margin-right:4px">🔄 Variante</span>
                <strong>${a.exercise}:</strong> ${a.reason}`;
            }
            html += `</div>`;
            return html;
          }).join('')}`;
        scr.appendChild(coachCard);
      }
    }
  } catch (err) {
    console.warn('Coach AI error:', err);
  }

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

    setTimeout(() => {
      renderChart(`progChart_${exName.replace(/\s+/g, '_')}`, exName, 15, '#34D399');
    }, 50);
  });

  scr.classList.add('active');
}
