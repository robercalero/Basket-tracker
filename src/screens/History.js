import { $, div } from '../utils/dom.js';
import { fmtDate } from '../utils/format.js';
import { dbGet, dbSet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';

export async function renderHistory() {
  const scr = $('history');
  if (!scr) return;
  scr.innerHTML = '';

  const log = await dbGet('log', []);
  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx] || PLANS[0];

  if (log.length === 0) {
    scr.innerHTML = `<div class="card text-center"><div style="font-size:40px;margin-bottom:8px">📜</div><div style="font-weight:700">Sin historial</div><p class="text-muted mt-8">Completa tu primer entrenamiento</p></div>`;
    scr.classList.add('active');
    return;
  }

  const header = div('card');
  header.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:14px;font-weight:700">Historial</div>
        <div style="font-size:12px;color:var(--tx2)">${log.length} entrenos registrados</div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="window.clearHistory()">Limpiar</button>
    </div>`;
  scr.appendChild(header);

  const reversed = [...log].reverse();
  reversed.forEach((l, idx) => {
    const item = div('hist-item');
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="hist-date">${fmtDate(l.d)}</div>
          <div class="hist-plan">${plan ? plan.name : 'Entreno'} · ${l.done ?? (l.ex ? l.ex.filter(e => e.s > 0).length : 0)} ejercicios</div>
        </div>
        <div style="font-size:12px;color:var(--tx2)">${Math.floor((l.dur || 0) / 60)}m ${(l.dur || 0) % 60}s</div>
      </div>
      <div class="hist-detail" id="histDetail_${idx}">
        ${(l.ex || []).map(e => `
          <div class="hist-ex">
            <span>${e.n}</span>
            <span>${e.s} series · ${e.w || '-'} kg</span>
          </div>`).join('')}
      </div>`;
    item.onclick = () => {
      const detail = document.getElementById(`histDetail_${idx}`);
      if (detail) detail.classList.toggle('open');
    };
    scr.appendChild(item);
  });

  scr.classList.add('active');
}

export async function clearHistory() {
  if (!confirm('¿Borrar todo el historial?')) return;
  await dbSet('log', []);
  await renderHistory();
}
