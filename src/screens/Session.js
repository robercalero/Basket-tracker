import { $ } from '../utils/dom.js';
import { todayKey, fmtSecs } from '../utils/format.js';
import { dbGet, dbSet } from '../services/storage.js';
import { beep, bDone, bPR } from '../services/audio.js';
import { PLANS } from '../data/plans/index.js';
import { REST, restStart, restStop } from '../components/RestTimer.js';
import { getCurrentWeek } from '../services/planUtils.js';
import { findExerciseByName, getVariants } from '../data/exercises/index.js';

export const SES = { idx: -1, sidx: 0, timer: null, paused: false, accum: 0, start: 0, manualSelect: false };
export let inSession = false;
export let HF = false;
let _currentExercises = null;

async function getDayIdx() {
  const dayMap = await dbGet('dayMap', {});
  return dayMap[todayKey()] ?? new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
}

export async function renderSession() {
  const scr = $('session');
  if (!scr) return;
  scr.innerHTML = '';

  const planIdx = await dbGet('planIdx', 0);
  const plan = PLANS[planIdx];
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
              <div class="ex-name"><span style="cursor:pointer" onclick="event.stopPropagation();window.showExerciseByName('${ex.name.replace(/'/g, "\\'")}')">${ex.name}</span></div>
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
  HF = false;
}

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
  const planIdx = await dbGet('planIdx', 0);
  const plan = PLANS[planIdx];
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

  // Ask for weight before logging
  const lastWeight = exLog.w || await dbGet('lastW.' + ex.name, 0);
  _pendingWeight = lastWeight;
  _pendingReps = 0;

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
  const totalSets = ex.sets * (ex.sets_work ?? 1);
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
      saveSession();
    }
  }

  renderSession();
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

export function selEx(i) {
  SES.idx = i;
  SES.sidx = 0;
  SES.manualSelect = true;
  renderSession();
}

export function swapExercise(variantName) {
  if (!inSession || !_currentExercises || SES.idx >= _currentExercises.length) return;

  const oldEx = _currentExercises[SES.idx];
  _currentExercises[SES.idx] = { ...oldEx, name: variantName };

  // Reset set counter for this exercise since we swapped
  const todayKeyVal = todayKey();
  dbGet('log', []).then(log => {
    const todayLog = log.find(l => l.d === todayKeyVal);
    if (todayLog) {
      const exLog = todayLog.ex.find(e => e.n === oldEx.name);
      if (exLog) {
        exLog.n = variantName;
        exLog.s = 0;
        exLog.sets = [];
        dbSet('log', log);
      }
    }
  });

  renderSession();
}

export function getExerciseVariants(exerciseName) {
  const ex = findExerciseByName(exerciseName);
  if (!ex) return [];
  const variants = getVariants(ex.id);
  if (variants.length === 0) {
    // No direct variants, suggest same muscle group exercises
    return [];
  }
  return variants.filter(v => v && v.name !== exerciseName);
}


