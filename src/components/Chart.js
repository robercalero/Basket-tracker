import { dbGet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';

function fmtDate(d) {
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

export async function renderChart(canvasId, exName, maxPoints = 20, color = '#7C5CFC') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;

  ctx.clearRect(0, 0, w, h);

  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx];
  if (!plan) return;

  const logs = await dbGet('log', []);
  const points = logs
    .flatMap(l => (l.ex ?? []).map(e => ({ ...e, date: l.d })))
    .filter(e => e.n === exName && e.w)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-maxPoints);

  if (points.length < 2) {
    ctx.fillStyle = '#5A5670';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Pocos datos para gráfico', w / 2, h / 2);
    return;
  }

  const maxW = Math.max(...points.map(p => p.w || 0));
  const minW = Math.max(0, maxW - maxW * 0.3);
  const pad = { t: 12, r: 8, b: 20, l: 8 };
  const gw = w - pad.l - pad.r;
  const gh = h - pad.t - pad.b;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();

  points.forEach((p, i) => {
    const x = pad.l + (i / (points.length - 1)) * gw;
    const y = pad.t + (1 - (p.w - minW) / (Math.max(maxW - minW, 1))) * gh;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = color + '30';
  ctx.lineTo(pad.l + gw, h - pad.b);
  ctx.lineTo(pad.l, h - pad.b);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#5A5670';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'center';
  points.forEach((p, i) => {
    if (i % Math.max(1, Math.floor(points.length / 5)) !== 0) return;
    const x = pad.l + (i / (points.length - 1)) * gw;
    ctx.fillText(fmtDate(p.date), x, h - 4);
  });

  ctx.fillStyle = '#E8E6F0';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'right';
  ctx.fillText(`${maxW} kg`, w - pad.r, pad.t + 10);
}
