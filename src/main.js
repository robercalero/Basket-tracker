import './styles/style.css';
import { $, div } from './utils/dom.js';
import { dbGet, dbSet } from './services/storage.js';
import { PLANS } from './data/plans/index.js';
import { reqNotif } from './services/notifications.js';
import { renderNav, updateNav } from './components/Nav.js';
import { restAdd, restSkip, renderRestTimer } from './components/RestTimer.js';
import { renderHome } from './screens/Home.js';
import { state } from './services/state.js';
import { initSync, onSyncStatus } from './services/sync.js';
import { advanceWeek } from './services/planUtils.js';
import { renderSession, startSession, endSession, toggleTimer, logSet, selEx, startTimerTick, inSession, SES } from './screens/Session.js';
import { renderStats } from './screens/Stats.js';
import { renderHistory, clearHistory } from './screens/History.js';
import { renderProgress } from './screens/Progress.js';
import { renderProfile, saveProfileField, saveCurrentWeight } from './screens/Profile.js';
import { renderPlans, selectPlan, toggleFilterLevel, toggleFilterGoal, clearFilters } from './screens/Plans.js';
import { renderInstall } from './screens/Install.js';
import { renderPlanCreator, startPlanCreator } from './screens/PlanCreator.js';
import { renderExerciseDetail } from './screens/ExerciseDetail.js';
import { renderPlanView } from './screens/PlanView.js';
import { renderExercises } from './screens/Exercises.js';

// Tab rendering map (exported for goTab to use)
const renderers = {
  home: renderHome,
  session: renderSession,
  stats: renderStats,
  history: renderHistory,
  progress: renderProgress,
  plans: renderPlans,
  profile: renderProfile,
  install: renderInstall,
  planCreator: renderPlanCreator,
  exerciseDetail: renderExerciseDetail,
  planView: renderPlanView,
  exercises: renderExercises,
};

// Override goTab to also render the target screen
window.goTab = async function(id, btn) {
  if (id === 'session' && state.curTab === 'session') return;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  state.curTab = id;
  updateNav(id);
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
  const fn = renderers[id];
  if (fn) {
    if (id === 'exerciseDetail') await fn(window.__exerciseId);
    else await fn();
  }
};
window.startSession = startSession;
window.endSession = endSession;
window.toggleTimer = toggleTimer;
window.logSet = logSet;
window.selEx = selEx;

window.showSwapOptions = async (name) => {
  const { getExerciseVariants } = await import('./screens/Session.js');
  const variants = getExerciseVariants(name);
  if (variants.length === 0) {
    alert('No hay variantes disponibles para este ejercicio');
    return;
  }
  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay show';
  overlay.innerHTML = `
    <div class="card rest-card" style="max-width:340px">
      <div style="font-size:16px;font-weight:700;margin-bottom:8px">Sustituir: ${name}</div>
      <div style="font-size:12px;color:var(--tx2);margin-bottom:12px">Elige una variante:</div>
      ${variants.map(v => `<div style="padding:10px 12px;background:var(--sf);border-radius:8px;margin-bottom:6px;cursor:pointer" onclick="window.doSwap('${v.name.replace(/'/g, "\\'")}')">
        <div style="font-weight:600;font-size:14px">${v.name}</div>
        <div style="font-size:12px;color:var(--tx2)">${v.description}</div>
      </div>`).join('')}
      <button class="btn btn-ghost btn-block" onclick="this.closest('.rest-overlay').remove()" style="margin-top:8px">Cancelar</button>
    </div>`;
  document.body.appendChild(overlay);
};
window.doSwap = async (variantName) => {
  // Remove the overlay
  const overlay = document.querySelector('.rest-overlay.show');
  if (overlay) overlay.remove();
  // Import and call swapExercise
  const { swapExercise, renderSession } = await import('./screens/Session.js');
  await swapExercise(variantName);
  await renderSession();
};
window.restAdd = restAdd;
window.restSkip = restSkip;
window.saveProfileField = saveProfileField;
window.selectPlan = selectPlan;
window.saveCurrentWeight = saveCurrentWeight;
window.toggleFilterLevel = toggleFilterLevel;
window.toggleFilterGoal = toggleFilterGoal;
window.clearFilters = clearFilters;
window.clearHistory = clearHistory;
window.advanceWeek = advanceWeek;
window.exportData = async () => {
  const { dbGet, dbKeys } = await import('./services/storage.js');
  const keys = await dbKeys();
  const data = {};
  for (const key of keys) {
    const val = await dbGet(key);
    // Strip internal _synced flag so re-import triggers fresh sync
    if (key === 'log' && Array.isArray(val)) {
      data[key] = val.map(w => { const { _synced, ...rest } = w; return rest });
    } else {
      data[key] = val;
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `baskettracker-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};
window.importData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async () => {
    const { dbSet } = await import('./services/storage.js');
    const file = input.files[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') { alert('Archivo inválido'); return }
    let count = 0;
    for (const [key, val] of Object.entries(data)) {
      await dbSet(key, val);
      count++;
    }
    alert(`Importados ${count} datos. Recarga la app.`);
    location.reload();
  };
  input.click();
};
window.clearAllData = async () => {
  if (!confirm('¿Eliminar TODOS tus datos? Esto no se puede deshacer.')) return;
  if (!confirm('¿Estás seguro? Se borrarán entrenamientos, peso y perfil.')) return;
  const { dbDel, dbKeys } = await import('./services/storage.js');
  const keys = await dbKeys();
  for (const key of keys) await dbDel(key);
  alert('Datos eliminados. Recarga la app.');
  location.reload();
};
window.goToWeek = async (weekIdx) => {
  const { dbGet, dbSet } = await import('./services/storage.js');
  const planIdx = await dbGet('planIdx', 0);
  await dbSet('planWeek_' + planIdx, weekIdx);
  await window.goTab('planView');
};
window.startPlanCreator = startPlanCreator;
window.showExercise = async (id) => {
  window.__exerciseId = id;
  await window.goTab('exerciseDetail');
};
window.showExerciseInfo = async (name) => {
  const { showExerciseInfo } = await import('./screens/Session.js');
  await showExerciseInfo(name);
};
window.showExerciseByName = async (name) => {
  const { findExerciseByName } = await import('./data/exercises/index.js');
  const ex = findExerciseByName(name);
  if (ex) window.showExercise(ex.id);
};
window.delCustPlan = async (id) => {
  const { deleteCustomPlan: delCust } = await import('./services/customPlans.js');
  await delCust(id);
  const { dbGet, dbSet, dbDel } = await import('./services/storage.js');
  const curId = await dbGet('customPlanId', null);
  if (curId === id) {
    await dbDel('customPlanId');
    await dbSet('planIdx', 0);
  }
  const { renderPlans } = await import('./screens/Plans.js');
  await renderPlans();
  window.goTab('plans');
};

async function init() {
  renderNav();
  renderRestTimer();

  // Nav click handler
  document.querySelector('.nav-inner')?.addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    window.goTab(item.dataset.tab, null);
  });

  // Visibility change for iOS timer background survival
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && inSession && !SES.paused) {
      startTimerTick();
    }
  });

  // Request notification permission
  reqNotif();

  // Initialize background sync
  initSync();
  onSyncStatus(status => {
    const dot = $('syncDot');
    if (!dot) return;
    dot.className = 'sync-indicator';
    if (status === 'syncing') dot.classList.add('syncing');
    else if (status === 'online') dot.classList.add('online');
    dot.title = status === 'syncing' ? 'Sincronizando...' : status === 'online' ? 'Conectado al servidor' : 'Sin conexión al servidor';
  });

  // Check onboarding
  const profile = await dbGet('profile', {});
  if (!profile.name) {
    showOnboarding();
  } else {
    // Show home by default
    $('home')?.classList.add('active');
    updateNav('home');
    await renderHome();
  }
}

async function showOnboarding() {
  const overlay = div('onboarding-overlay show');
  overlay.id = 'onboardingOverlay';
  overlay.innerHTML = `
    <div class="card onboarding-card">
      <div style="font-size:48px;margin-bottom:12px">🏀</div>
      <h2>Bienvenido a BasketTracker</h2>
      <p>Tu entrenador personal de gimnasio con inteligencia artificial. Sigue rutinas estructuradas, registra tus progresos y transfiere tu fuerza al deporte que elijas.</p>
      <div class="profile-field">
        <label>Tu nombre</label>
        <input type="text" id="onboardName" placeholder="Ej: Roberto" style="width:100%;padding:12px 16px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:16px;text-align:center">
      </div>
      <div class="profile-field">
        <label>Tu deporte</label>
        <select id="onboardSport" style="width:100%;padding:12px 16px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:16px">
          <option value="basketball" selected>🏀 Básquetbol</option>
          <option value="football">⚽ Fútbol</option>
          <option value="running">🏃 Running</option>
          <option value="tennis">🎾 Tenis</option>
          <option value="crossfit">💥 CrossFit</option>
          <option value="general">🏋️ General</option>
        </select>
      </div>
      <div class="profile-field">
        <label>Tu plan de entrenamiento</label>
        <select id="onboardPlan" style="width:100%;padding:12px 16px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:16px">
          ${PLANS.map((p, i) => `<option value="${i}">${p.emoji} ${p.name}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-block mt-12" id="onboardBtn">Comenzar</button>
    </div>`;
  document.body.appendChild(overlay);

  $('onboardBtn')?.addEventListener('click', async () => {
    const name = $('onboardName')?.value.trim();
    if (!name) { $('onboardName')?.focus(); return }
    const planIdx = parseInt($('onboardPlan')?.value || '0');
    const sport = $('onboardSport')?.value || 'basketball';
    await dbSet('profile', { name, gender: 'male', dob: '', height: 175, sport });
    await dbSet('planIdx', planIdx);
    $('onboardingOverlay')?.remove();
    $('home')?.classList.add('active');
    updateNav('home');
    await renderHome();
  });
}

// Coach AI query
window.askCoach = async () => {
  const btn = document.getElementById('coachAskBtn');
  const input = document.getElementById('coachQuery');
  const responseDiv = document.getElementById('coachResponse');
  const query = input?.value?.trim();
  if (!query || !btn) return;

  btn.disabled = true;
  btn.textContent = 'Pensando...';
  responseDiv.style.display = 'none';

  try {
    const log = await dbGet('log', []);
    const profile = await dbGet('profile', { sport: 'basketball' });
    const exerciseLog = log.filter(l => l.ex?.length > 0).slice(-10).flatMap(l => l.ex);

    const r = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseLog, query, sport: profile.sport || 'basketball' }),
    });
    const data = await r.json();
    responseDiv.textContent = data.advice || 'Sin respuesta del coach. Intenta de nuevo.';
    responseDiv.style.display = 'block';
  } catch (err) {
    responseDiv.textContent = 'Error al consultar al coach. Verifica tu conexión e intenta de nuevo.';
    responseDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Preguntar';
  }
};

// PWA install prompt
window.__deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  window.__deferredPrompt = e;
  const installBtn = document.querySelector('#installBtn');
  if (installBtn) installBtn.style.display = 'inline-flex';
});
window.installApp = async () => {
  const prompt = window.__deferredPrompt;
  if (!prompt) return;
  prompt.prompt();
  const result = await prompt.userChoice;
  window.__deferredPrompt = null;
  const installBtn = document.querySelector('#installBtn');
  if (installBtn) installBtn.style.display = 'none';
};

init();
