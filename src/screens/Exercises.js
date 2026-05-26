import { $ } from '../utils/dom.js';
import { EXERCISES, MUSCLE_GROUPS, getExercisesGroupedByMuscle } from '../data/exercises/index.js';

let _activeFilter = null;
let _searchQuery = '';

export async function renderExercises() {
  const scr = $('exercises');
  if (!scr) return;
  scr.innerHTML = '';

  const grouped = getExercisesGroupedByMuscle();
  const muscleKeys = Object.keys(grouped);
  const allGroups = MUSCLE_GROUPS.reduce((acc, mg) => {
    if (grouped[mg.id]) acc.push({ ...mg, exercises: grouped[mg.id] });
    return acc;
  }, []);

  scr.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:24px">🏋️</span>
        <div>
          <div style="font-size:18px;font-weight:700">Ejercicios</div>
          <div style="font-size:12px;color:var(--tx2)">${EXERCISES.length} ejercicios en total</div>
        </div>
      </div>
      <input type="text" id="exSearch" placeholder="Buscar ejercicio..." style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:14px;margin-bottom:8px">
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px">
        <span class="filter-chip ${_activeFilter === null ? 'active' : ''}" data-filter="" onclick="window.filterExercises(null)" style="padding:4px 10px;border-radius:20px;font-size:11px;cursor:pointer;background:var(--cl);color:var(--tx2)">Todos</span>
        ${allGroups.map(g => `
          <span class="filter-chip ${_activeFilter === g.id ? 'active' : ''}" data-filter="${g.id}" onclick="window.filterExercises('${g.id}')" style="padding:4px 10px;border-radius:20px;font-size:11px;cursor:pointer;background:var(--cl);color:var(--tx2)">${g.emoji || '🏋️'} ${g.name}</span>
        `).join('')}
      </div>
    </div>
    <div id="exGrid"></div>
  `;

  const searchInput = document.getElementById('exSearch');
  searchInput.addEventListener('input', () => {
    _searchQuery = searchInput.value;
    renderExerciseGrid(grouped, allGroups);
  });

  renderExerciseGrid(grouped, allGroups);
  scr.classList.add('active');
}

function renderExerciseGrid(grouped, allGroups) {
  const grid = document.getElementById('exGrid');
  if (!grid) return;

  let exercises = [];

  if (_activeFilter) {
    const g = grouped[_activeFilter];
    if (g) exercises = g;
  } else {
    const seen = new Set();
    for (const g of allGroups) {
      for (const ex of g.exercises) {
        if (!seen.has(ex.id)) { seen.add(ex.id); exercises.push(ex); }
      }
    }
  }

  if (_searchQuery) {
    const q = _searchQuery.toLowerCase();
    exercises = exercises.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.muscleGroup.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.equipment.toLowerCase().includes(q)
    );
  }

  if (exercises.length === 0) {
    grid.innerHTML = '<div class="card text-center"><p style="color:var(--tx3)">Sin resultados</p></div>';
    return;
  }

  grid.innerHTML = exercises.map(ex => {
    const muscleInfo = MUSCLE_GROUPS.find(mg => mg.id === ex.muscleGroup);
    return `<div class="card" style="cursor:pointer;padding:12px" onclick="window.showExercise('${ex.id}')">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:40px;height:40px;border-radius:8px;background:var(--sf);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${muscleInfo?.emoji || '🏋️'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:14px">${ex.name}</div>
          <div style="font-size:11px;color:var(--tx2);margin-top:2px">${muscleInfo?.name || ex.muscleGroup} · ${ex.equipment}</div>
        </div>
        <span style="font-size:18px;color:var(--tx3)">›</span>
      </div>
    </div>`;
  }).join('');
}

window.filterExercises = (filter) => {
  _activeFilter = filter;
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => chip.classList.toggle('active', (chip.dataset.filter || '') === (filter || '')));
  const grouped = getExercisesGroupedByMuscle();
  const allGroups = MUSCLE_GROUPS.reduce((acc, mg) => {
    if (grouped[mg.id]) acc.push({ ...mg, exercises: grouped[mg.id] });
    return acc;
  }, []);
  renderExerciseGrid(grouped, allGroups);
};
