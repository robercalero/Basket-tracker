import { $, div } from '../utils/dom.js';
import { fmtSecs } from '../utils/format.js';
import { bDone, bPR, bTick } from '../services/audio.js';
import { sendNotif } from '../services/notifications.js';

export const REST = { active: false, endTime: 0, total: 90, timer: null, tick: null, ticked10: false };
const R = 70, CIRC = 2 * Math.PI * R;

export function renderRestTimer() {
  const old = document.querySelector('.rest-overlay');
  if (old) old.remove();

  const svg = `<svg width="160" height="160" viewBox="0 0 160 160">
    <circle class="rest-ring-bg" cx="80" cy="80" r="${R}"/>
    <circle class="rest-ring-fg" id="restRing" cx="80" cy="80" r="${R}" stroke-dashoffset="0" stroke-dasharray="${CIRC}"/>
  </svg>`;

  const overlay = div('rest-overlay');
  overlay.id = 'restOverlay';
  overlay.innerHTML = `
    <div class="card rest-card">
      <div class="rest-ring-wrap">
        ${svg}
        <div class="rest-time" id="restTime">01:30</div>
      </div>
      <div class="rest-label" id="restExName">Descanso</div>
      <div class="rest-actions">
        <button class="btn btn-sm btn-ghost" onclick="window.restAdd(15)">+15s</button>
        <button class="btn btn-sm btn-ghost" onclick="window.restAdd(30)">+30s</button>
        <button class="btn btn-sm btn-ghost" onclick="window.restAdd(60)">+60s</button>
        <button class="btn btn-sm btn-primary" onclick="window.restSkip()">Saltar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

export function restStart(exName, secs) {
  REST.active = true;
  REST.endTime = Date.now() + secs * 1000;
  REST.total = secs;
  REST.ticked10 = false;
  const overlay = $('restOverlay');
  if (overlay) overlay.classList.add('show');
  const label = $('restExName');
  if (label) label.textContent = exName || 'Descanso';
  restTick();
  REST.tick = setInterval(restTick, 200);
}

function restTick() {
  const left = Math.max(0, Math.round((REST.endTime - Date.now()) / 1000));
  const el = $('restTime');
  const ring = document.getElementById('restRing');
  if (el) el.textContent = fmtSecs(left);
  if (ring) {
    const offset = REST.total > 0 ? CIRC * (1 - left / REST.total) : 0;
    ring.style.strokeDashoffset = offset;
  }
  if (left === 10 && !REST.ticked10) { REST.ticked10 = true; bTick() }
  if (left < 10) REST.ticked10 = false;
  if (left <= 0) { restStop(); bDone(); sendNotif('Descanso terminado', 'Siguiente serie!'); }
}

export function restStop() {
  REST.active = false;
  if (REST.tick) { clearInterval(REST.tick); REST.tick = null }
  const overlay = $('restOverlay');
  if (overlay) overlay.classList.remove('show');
}

export function restAdd(secs) {
  if (!REST.active) return;
  REST.endTime += secs * 1000;
  REST.total += secs;
}

export function restSkip() { restStop(); bPR() }
