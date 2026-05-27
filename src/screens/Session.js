import { $ } from '../utils/dom.js';
import { todayKey, fmtSecs } from '../utils/format.js';
import { dbGet, dbSet } from '../services/storage.js';
import { beep, bDone, bPR } from '../services/audio.js';
import { PLANS } from '../data/plans/index.js';
import { REST, restStart, restStop } from '../components/RestTimer.js';
import { getCurrentWeek } from '../services/planUtils.js';
import { findExerciseByName, getVariants, getExercise } from '../data/exercises/index.js';

const GOAL_PCTS = {
  strength: { min: 0.80, max: 0.90, label: '80-90%' },
  hypertrophy: { min: 0.65, max: 0.80, label: '65-80%' },
  endurance: { min: 0.50, max: 0.65, label: '50-65%' },
};
const GOAL_NAMES = { strength: 'Fuerza', hypertrophy: 'Hipertrofia', endurance: 'Resistencia' };

function estimate1RM(weight, reps) {
  if (!weight || !reps) return null;
  return weight * (1 + reps / 30);
}

export const SES = { idx: -1, sidx: 0, timer: null, paused: false, accum: 0, start: 0, manualSelect: false };
export let inSession = false;
let _currentExercises = null;

async function getDayIdx() {
  const dayMap = await dbGet('dayMap', {});
  return dayMap[todayKey()] ?? (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
}

export async function renderSession() {
  const scr = $('session');
  if (!scr) return;
  scr.innerHTML = '';

  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx];
  if (!plan || !plan.weeks || !plan.weeks.length) {
    scr.innerHTML = `<div class="card text-center"><div style="font-size:40px;margin-bottom:8px">📋</div><div style="font-weight:700">No hay plan seleccionado</div><p class="text-muted mt-8">Ve a Perfil para elegir un plan</p></div>`;
    scr.classList.add('active');
    return;
  }

  const { week, weekIdx, totalWeeks } = await getCurrentWeek();
  const dayIdx = await getDayIdx();
  const exercises = week ? (week.days[dayIdx] || null) : null;
  if (!exercises) {
    scr.innerHTML = `<div class="card text-center"><div style="font-size:40px">🏖️</div><div style="font-weight:700;margin-top:8px">Hoy no hay entrenamiento</div><p class="text-muted mt-8">Es tu día de descanso</p></div>`;
    scr.classList.add('active');
    return;
  }

  const log = await dbGet('log', []);
  const todayLog = log.find(l => l.d === todayKey());
  const doneSetCounts = {};
  if (todayLog && todayLog.ex) {
    todayLog.ex.forEach(e => { doneSetCounts[e.n] = e.s });
  }
  const warmupSets = await dbGet('wu', {});

  // Determine current exercise (skip if user manually selected one)
  let curEx = SES.idx >= 0 ? SES.idx : 0;
  if (!SES.manualSelect) {
    curEx = 0;
    if (todayLog && todayLog.ex) {
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        const done = doneSetCounts[ex.name] || 0;
        if (done < ex.sets * (ex.sets_work ?? 1)) { curEx = i; break; }
      }
    }
    SES.idx = curEx;
  }
  SES.sidx = doneSetCounts[exercises[SES.idx]?.name] || 0;

  // Store for swap function
  _currentExercises = exercises;

  // Warmup toggle
  const wuOn = warmupSets[todayKey()];
  const showWu = wuOn ? exercises[SES.idx]?.name : null;

  scr.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:11px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px">${plan.name} ${totalWeeks > 1 ? `· Semana ${weekIdx + 1}/${totalWeeks}` : ''}</div>
          <div style="font-weight:600;font-size:14px">${exercises[SES.idx]?.name || 'Completado'} ${showWu ? '<span class="warmup-badge">CALENTAMIENTO</span>' : ''}</div>
        </div>
        <button class="btn btn-sm ${inSession ? 'btn-danger' : 'btn-success'}" id="timerToggle" onclick="window.toggleTimer()">${inSession ? '⏹' : '▶'}</button>
      </div>
      <div class="timer-wrap">
        <div class="timer-display" id="timerDisplay">${inSession ? fmtSecs(Math.floor((Date.now() - SES.start + SES.accum) / 1000)) : '00:00'}</div>
        <div class="timer-label">Tiempo de sesión</div>
      </div>
      ${!inSession ? '<button class="btn btn-primary btn-block" onclick="window.startSession()">Comenzar sesión</button>' : '<button class="btn btn-danger btn-block" onclick="window.endSession()">Finalizar sesión</button>'}
    </div>

    <div class="exercise-list" id="exList">
      ${exercises.map((ex, i) => {
        const done = doneSetCounts[ex.name] || 0;
        const total = ex.sets * (ex.sets_work ?? 1);
        const isCurrent = i === curEx && inSession;
        const isDone = done >= total;
        const wuActive = showWu && i === curEx;
        return `
          <div class="ex-item${isCurrent ? ' current' : ''}${isDone ? ' done' : ''}" onclick="window.selEx(${i})">
            <div class="ex-num${wuActive ? ' warmup' : ''}">${i + 1}</div>
            <div class="ex-info">
              <div class="ex-name">
                <span onclick="event.stopPropagation();window.showExerciseInfo('${ex.name.replace(/'/g, "\\'")}')">${ex.name} <span style="font-size:12px;opacity:0.5;cursor:pointer" title="Ver info del ejercicio">ℹ️</span></span>
              </div>
              <div class="ex-detail">${done}/${total} series · ${ex.reps} reps · ${ex.rir} RIR ${wuActive ? '· CALENTAMIENTO' : ''}</div>
            </div>
            <div class="ex-actions">
              ${done > 0 ? `<span class="set-badge done">${done}/${total}</span>` : ''}
              ${isCurrent && inSession ? `<button class="btn btn-sm btn-success" onclick="event.stopPropagation();window.logSet()" style="margin-right:4px">+</button>` : ''}
              ${isCurrent && inSession ? `<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();window.showSwapOptions('${ex.name.replace(/'/g, "\\'")}')" title="Sustituir ejercicio">↻</button>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>

    `;

  scr.classList.add('active');
}

let _logSetLock = false;

export async function startSession() {
  if (inSession) return;
  inSession = true;
  SES.start = Date.now();

  _currentExercises = null;
  SES.accum = 0;
  SES.paused = false;
  SES.manualSelect = false;
  startTimerTick();
  await renderSession();
}

export async function endSession() {
  if (!inSession) return;
  inSession = false;
  if (SES.timer) { clearInterval(SES.timer); SES.timer = null }
  if (REST.active) restStop();
  await saveSession();
}

export function toggleTimer() {
  if (!inSession) return;
  SES.paused = !SES.paused;
  if (SES.paused) {
    SES.accum += Date.now() - SES.start;
    if (SES.timer) { clearInterval(SES.timer); SES.timer = null }
  } else {
    SES.start = Date.now();
    startTimerTick();
  }
  const btn = $('timerToggle');
  if (btn) btn.textContent = SES.paused ? '▶' : '⏹';
}

export function startTimerTick() {
  if (SES.timer) { clearInterval(SES.timer); SES.timer = null }
  SES.timer = setInterval(() => {
    if (!inSession || SES.paused) return;
    const el = $('timerDisplay');
    if (el) el.textContent = fmtSecs(Math.floor((Date.now() - SES.start + SES.accum) / 1000));
  }, 500);
}

let _pendingWeight = null;
let _pendingReps = null;

export function showWeightPrompt(exReps, lastData) {
  return new Promise(resolve => {
    const exName = document.querySelector('.ex-item.current .ex-name')?.textContent || 'Ejercicio';
    const overlay = document.createElement('div');
    overlay.className = 'rest-overlay show';
    overlay.id = 'weightPrompt';
    overlay.innerHTML = `
      <div class="card rest-card" style="max-width:340px">
        <div style="font-size:20px;font-weight:700;margin-bottom:4px">${exName}</div>
        ${lastData ? `<div style="font-size:12px;color:var(--tx2);margin-bottom:12px;padding:8px 10px;background:var(--sf);border-radius:8px">Última sesión: <strong>${lastData.w} kg</strong> × <strong>${lastData.r || '?'} reps</strong>${lastData.d ? '<br><span style="font-size:11px">' + lastData.d + '</span>' : ''}</div>` : ''}
        <div style="display:flex;gap:12px;margin-bottom:16px">
          <div style="flex:1">
            <div style="font-size:11px;color:var(--tx2);margin-bottom:4px">Peso (kg)</div>
            <input type="number" id="weightInputPrompt" step="0.5" min="0" placeholder="0" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:20px;font-weight:700;text-align:center" autofocus>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;color:var(--tx2);margin-bottom:4px">Reps reales</div>
            <input type="number" id="repsInputPrompt" step="1" min="0" placeholder="${exReps}" style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:20px;font-weight:700;text-align:center">
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost flex-1" id="weightSkipBtn">Sin peso</button>
          <button class="btn btn-primary flex-1" id="weightConfirmBtn">✓ Confirmar</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const wInput = overlay.querySelector('#weightInputPrompt');
    const rInput = overlay.querySelector('#repsInputPrompt');
    if (_pendingWeight > 0) wInput.value = _pendingWeight;
    if (_pendingReps > 0) rInput.value = _pendingReps;
    wInput.focus();
    setTimeout(() => wInput.focus(), 100);

    const close = (weight, reps) => {
      _pendingWeight = weight;
      _pendingReps = reps;
      overlay.remove();
      resolve({ weight, reps });
    };

    overlay.querySelector('#weightConfirmBtn').onclick = () => close(parseFloat(wInput.value) || 0, parseInt(rInput.value) || 0);
    overlay.querySelector('#weightSkipBtn').onclick = () => close(0, 0);
    wInput.onkeydown = e => { if (e.key === 'Enter') rInput.focus() };
    rInput.onkeydown = e => { if (e.key === 'Enter') close(parseFloat(wInput.value) || 0, parseInt(rInput.value) || 0) };
  });
}

export async function logSet() {
  if (!inSession) return;
  if (_logSetLock) return;
  _logSetLock = true;
  try {
    const planIdx = await dbGet('planIdx', 0);
    const customPlans = await dbGet('customPlans', []);
    const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
    const plan = allPlans[planIdx];
    if (!plan) return;
    const { week } = await getCurrentWeek();
    if (!week) return;
    const dayIdx = await getDayIdx();
    const exercises = week.days[dayIdx] || null;
    if (!exercises || SES.idx >= exercises.length) return;

    const ex = exercises[SES.idx];
    const log = await dbGet('log', []);
    let todayLog = log.find(l => l.d === todayKey());
    if (!todayLog) {
      todayLog = { d: todayKey(), p: planIdx, dur: 0, ex: [] };
      log.push(todayLog);
    }

    let exLog = todayLog.ex.find(e => e.n === ex.name);
    if (!exLog) {
      exLog = { n: ex.name, s: 0, w: 0, r: ex.reps, ri: ex.rir, sets: [] };
      todayLog.ex.push(exLog);
    }

    // Find last session data for this exercise
    let lastData = null;
    for (let i = log.length - 1; i >= 0; i--) {
      const prevLog = log[i];
      if (prevLog.d === todayKey()) continue;
      const prevEx = prevLog.ex?.find(e => e.n === ex.name);
      if (prevEx && (prevEx.w > 0 || prevEx.sets?.length > 0)) {
        const lastSet = prevEx.sets?.length > 0 ? prevEx.sets[prevEx.sets.length - 1] : null;
        lastData = {
          w: lastSet?.w || prevEx.w || 0,
          r: lastSet?.r || prevEx.r || 0,
          d: prevLog.d,
        };
        break;
      }
    }

    // Ask for weight before logging
    const lastWeight = exLog.w || await dbGet('lastW.' + ex.name, 0);
    _pendingWeight = lastWeight;
    _pendingReps = lastData?.r || 0;

    const { weight, reps: actualReps } = await showWeightPrompt(ex.reps, lastData);

    exLog.s = (exLog.s || 0) + 1;
    const wuSets = await dbGet('wu', {});
    const inWu = wuSets[todayKey()] && SES.sidx === 0;

    exLog.sets.push({
      idx: exLog.s - 1,
      w: weight,
      r: actualReps || ex.reps,
      ri: ex.rir,
      wu: inWu,
      time: Date.now(),
    });

    // Update exLog.w with actual weight used
    if (weight > 0) exLog.w = weight;

    await dbSet('log', log);
    if (weight > 0) await dbSet('lastW.' + ex.name, weight);

    SES.sidx = exLog.s;
    beep(660, .1);

    // Check if exercise is complete
    const totalSets = (ex.sets || 0) * (ex.sets_work ?? 1);
    const wuTotal = inWu ? 1 : 0;
    if (exLog.s >= totalSets + wuTotal) {
      SES.manualSelect = false;
      // Move to next exercise
      if (SES.idx + 1 < exercises.length) {
        SES.idx++;
        SES.sidx = 0;
        restStart(exercises[SES.idx]?.name || 'Descanso', 90);
      } else {
        // All exercises done
        if (REST.active) restStop();
        bPR();
        inSession = false;
        if (SES.timer) { clearInterval(SES.timer); SES.timer = null }
        await saveSession();
      }
    }

    await renderSession();
  } finally {
    _logSetLock = false;
  }
}

export async function saveSession() {
  const log = await dbGet('log', []);
  const todayLog = log.find(l => l.d === todayKey());
  if (!todayLog) return;
  todayLog.dur = Math.floor((Date.now() - SES.start + SES.accum) / 1000);
  todayLog.done = todayLog.ex ? todayLog.ex.filter(e => e.s > 0).length : 0;
  await dbSet('log', log);
  bDone();
  window.goTab('stats', null);
}

export async function selEx(i) {
  SES.idx = i;
  SES.sidx = 0;
  SES.manualSelect = true;
  await renderSession();
}

export async function swapExercise(variantName) {
  if (!inSession || !_currentExercises || SES.idx >= _currentExercises.length) return;

  const oldEx = _currentExercises[SES.idx];
  _currentExercises[SES.idx] = { ...oldEx, name: variantName };

  const todayKeyVal = todayKey();
  const log = await dbGet('log', []);
  const todayLog = log.find(l => l.d === todayKeyVal);
  if (todayLog) {
    const exLog = todayLog.ex.find(e => e.n === oldEx.name);
    if (exLog) {
      exLog.n = variantName;
      exLog.s = 0;
      exLog.sets = [];
      await dbSet('log', log);
    }
  }

  await renderSession();
}

export async function showExerciseInfo(exName) {
  const ex = findExerciseByName(exName);
  if (!ex) return;

  const planIdx = await dbGet('planIdx', 0);
  const customPlans = await dbGet('customPlans', []);
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx];
  const goal = plan?.goal || 'hypertrophy';
  const pct = GOAL_PCTS[goal] || GOAL_PCTS.hypertrophy;

  // Find last logged weight
  const log = await dbGet('log', []);
  let lastWeight = 0;
  let lastReps = 0;
  let lastDate = '';

  for (let i = log.length - 1; i >= 0; i--) {
    const day = log[i];
    const exLog = day.ex?.find(e => e.n === exName);
    if (exLog) {
      const set = exLog.sets?.length > 0 ? exLog.sets[exLog.sets.length - 1] : null;
      lastWeight = set?.w || exLog.w || 0;
      lastReps = set?.r || exLog.r || 0;
      lastDate = day.d;
      if (lastWeight > 0) break;
    }
  }

  let suggestedHtml = '';
  if (lastWeight > 0 && lastReps > 0) {
    const est1RM = estimate1RM(lastWeight, lastReps);
    if (est1RM) {
      const minW = Math.round(est1RM * pct.min / 2.5) * 2.5;
      const maxW = Math.round(est1RM * pct.max / 2.5) * 2.5;
      suggestedHtml = `
        <div style="padding:12px;background:var(--sf);border-radius:10px;margin-top:10px">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px">💪 Peso sugerido (${GOAL_NAMES[goal]})</div>
          <div style="font-size:18px;font-weight:800;color:var(--ac)">${minW} – ${maxW} kg</div>
          <div style="font-size:11px;color:var(--tx2);margin-top:2px">${pct.label} de 1RM (estimado ${Math.round(est1RM)} kg)</div>
          <div style="font-size:11px;color:var(--tx2);margin-top:4px">Basado en último registro: ${lastWeight} kg × ${lastReps} reps (${lastDate})</div>
        </div>`;
    }
  } else if (lastWeight > 0) {
    suggestedHtml = `
      <div style="padding:12px;background:var(--sf);border-radius:10px;margin-top:10px">
        <div style="font-weight:600;font-size:13px;margin-bottom:4px">💪 Último peso registrado</div>
        <div style="font-size:18px;font-weight:800;color:var(--ac)">${lastWeight} kg</div>
        <div style="font-size:11px;color:var(--tx2);margin-top:2px">Registra reps para estimar 1RM y sugerir rango</div>
      </div>`;
  } else {
    suggestedHtml = `
      <div style="padding:12px;background:var(--sf);border-radius:10px;margin-top:10px">
        <div style="font-weight:600;font-size:13px;margin-bottom:4px">💪 Peso sugerido</div>
        <div style="font-size:13px;color:var(--tx2)">Aún sin datos. Comienza con peso ligero y ajusta según RPE.</div>
      </div>`;
  }

  const muscleLabels = { chest: 'Pecho', back: 'Espalda', shoulders: 'Hombros', arms: 'Brazos', legs: 'Piernas', abs: 'Abdominales' };
  const equipLabels = { barbell: 'Barra', dumbbell: 'Mancuernas', cable: 'Cable', machine: 'Máquina', bodyweight: 'Bodyweight', bands: 'Bandas', kettlebell: 'Pesa rusa' };
  const levelLabels = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay show';
  overlay.id = 'exerciseInfoOverlay';
  overlay.innerHTML = `
    <div class="card rest-card" style="max-width:360px;text-align:left">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-size:18px;font-weight:700">${ex.name}</div>
          <div style="font-size:12px;color:var(--tx2);margin-top:2px">
            ${muscleLabels[ex.muscleGroup] || ex.muscleGroup} · ${equipLabels[ex.equipment] || ex.equipment} · ${levelLabels[ex.level] || ex.level}
          </div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="this.closest('.rest-overlay').remove()" style="font-size:16px;padding:4px 8px">✕</button>
      </div>

      <div style="padding:12px;background:var(--sf);border-radius:10px">
        <div style="font-weight:600;font-size:12px;margin-bottom:4px;color:var(--tx2)">📝 Cómo hacerlo</div>
        <div style="font-size:13px;line-height:1.5">${ex.description}</div>
      </div>

      ${suggestedHtml}

      <button class="btn btn-ghost btn-block" onclick="this.closest('.rest-overlay').remove()" style="margin-top:12px">Cerrar</button>
    </div>`;
  document.body.appendChild(overlay);
}

export function getExerciseVariants(exerciseName) {
  const ex = findExerciseByName(exerciseName);
  if (!ex) return [];
  const variants = getVariants(ex.id);
  if (variants.length === 0) {
    return [];
  }
  return variants.filter(v => v && v.name !== exerciseName);
}


