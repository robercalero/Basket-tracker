import { $, div } from '../utils/dom.js';
import { getExercise, getVariants, getExercisesByMuscle, MUSCLE_GROUPS, EQUIPMENT_TYPES } from '../data/exercises/index.js';

export async function renderExerciseDetail(exerciseId) {
  const scr = $('exerciseDetail');
  if (!scr) return;
  scr.innerHTML = '';

  const ex = getExercise(exerciseId);
  if (!ex) {
    scr.innerHTML = `<div class="card text-center"><p>Ejercicio no encontrado</p>
      <button class="btn btn-ghost" onclick="window.goTab('home')">Volver</button></div>`;
    scr.classList.add('active');
    return;
  }

  const variants = getVariants(ex.id);
  const sameMuscle = getExercisesByMuscle(ex.muscleGroup).filter(e => e.id !== ex.id);

  const muscleInfo = MUSCLE_GROUPS.find(mg => mg.id === ex.muscleGroup);
  const muscleLabel = muscleInfo?.name || ex.muscleGroup;
  const equipInfo = EQUIPMENT_TYPES.find(eq => eq.id === ex.equipment);
  const equipLabel = equipInfo?.name || ex.equipment;

  scr.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <button class="btn btn-sm btn-ghost" onclick="window.goTab('home')" style="font-size:18px">←</button>
        <div>
          <div style="font-size:18px;font-weight:700">${ex.name}</div>
          <div style="font-size:12px;color:var(--tx2)">${muscleLabel} · ${equipLabel}</div>
        </div>
      </div>

      ${ex.image ? `<div class="exercise-detail-img">
        <img src="/exercises/${ex.image}" alt="${ex.name}" onerror="this.onerror=null;this.src='/exercises/muscle-${ex.muscleGroup}.svg'">
      </div>` : muscleInfo?.emoji ? `<div class="exercise-detail-img" style="font-size:64px">${muscleInfo.emoji}</div>` : `<div class="exercise-detail-img"><img src="/exercises/muscle-${ex.muscleGroup}.svg" alt="${muscleLabel}" style="opacity:0.6"></div>`}

      <p style="font-size:14px;color:var(--tx);line-height:1.6;margin-bottom:12px">${ex.description}</p>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <span style="font-size:11px;background:var(--cl);padding:4px 10px;border-radius:20px;color:var(--tx2)">${muscleLabel}</span>
        <span style="font-size:11px;background:var(--cl);padding:4px 10px;border-radius:20px;color:var(--tx2)">${equipLabel}</span>
        <span style="font-size:11px;background:var(--cl);padding:4px 10px;border-radius:20px;color:var(--tx2)">${ex.level === 'beginner' ? 'Principiante' : ex.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
      </div>
    </div>

    ${variants.length > 0 ? `
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Variantes</div>
      ${variants.map(v => `
        <div class="plan-card" onclick="window.showExercise('${v.id}')" style="cursor:pointer">
          <span class="plan-emoji">🏋️</span>
          <div class="plan-info">
            <div class="plan-name">${v.name}</div>
            <div class="plan-desc">${v.description}</div>
          </div>
        </div>`).join('')}
    </div>` : ''}

    ${sameMuscle.length > 0 ? `
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Más ejercicios de ${muscleLabel}</div>
      ${sameMuscle.slice(0, 6).map(e => `
        <div class="plan-card" onclick="window.showExercise('${e.id}')" style="cursor:pointer">
          <span class="plan-emoji">🏋️</span>
          <div class="plan-info">
            <div class="plan-name">${e.name}</div>
            <div class="plan-desc">${e.description}</div>
          </div>
        </div>`).join('')}
    </div>` : ''}

    <div class="card text-center">
      <button class="btn btn-sm btn-ghost" onclick="window.goTab('home')">Volver al inicio</button>
    </div>`;

  scr.classList.add('active');
}
