import { $ } from '../utils/dom.js';
import { dbGet, dbSet } from '../services/storage.js';
import { findActivePlanIdx } from './Plans.js';
import { SPORTS } from '../data/sports.js';

export async function renderProfile() {
  const scr = $('profile');
  if (!scr) return;
  scr.innerHTML = '';

  const profile = await dbGet('profile', { name: '', gender: 'male', dob: '', height: 175, sport: 'basketball' });
  const planIdx = await findActivePlanIdx();
  const weightLog = await dbGet('weightLog', []);
  const sport = SPORTS.find(s => s.id === profile.sport) || SPORTS[0];

  scr.innerHTML = `
    <div class="card text-center">
      <div class="profile-avatar">${profile.name ? profile.name[0].toUpperCase() : '?'}</div>
      <div style="font-size:18px;font-weight:700">${profile.name || 'Sin nombre'}</div>
      <div style="font-size:12px;color:var(--tx2);margin-top:2px">${sport.emoji} ${sport.name}</div>
    </div>

    <div class="card">
      <div style="font-size:11px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Datos personales</div>
      <div class="profile-field">
        <label>Nombre</label>
        <input type="text" id="profName" value="${profile.name || ''}" placeholder="Tu nombre" onchange="saveProfileField('name',this.value)">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="profile-field">
          <label>Género</label>
          <select id="profGender" onchange="saveProfileField('gender',this.value)">
            <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>Hombre</option>
            <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>Mujer</option>
          </select>
        </div>
        <div class="profile-field">
          <label>Altura (cm)</label>
          <input type="number" id="profHeight" value="${profile.height || 175}" placeholder="175" onchange="saveProfileField('height',this.value)">
        </div>
      </div>
      <div class="profile-field">
        <label>Deporte</label>
        <select id="profSport" onchange="saveProfileField('sport',this.value)">
          ${SPORTS.map(s => `<option value="${s.id}" ${profile.sport === s.id ? 'selected' : ''}>${s.emoji} ${s.name}</option>`).join('')}
        </select>
      </div>
      <div style="padding:8px 12px;background:var(--sf);border-radius:8px;font-size:12px;color:var(--tx2)">
        ${sport.attributes.map(a => a.emoji).join(' ')} El coach adapta sus consejos a <strong>${sport.name}</strong>
      </div>
    </div>

    <div class="card">
      <div style="font-size:11px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Peso corporal</div>
      <div class="weight-input-wrap">
        <input type="number" id="weightInput" step="0.1" placeholder="kg" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--br);background:var(--sf);color:var(--tx);font-size:15px">
        <button class="btn btn-sm btn-primary" onclick="saveCurrentWeight()">Guardar</button>
      </div>
      <div style="margin-top:8px;max-height:160px;overflow-y:auto">
        ${weightLog.slice(-10).reverse().map(w => `
          <div class="weight-entry">
            <span>${new Date(w.d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
            <span>${w.w} kg</span>
          </div>`).join('')}
        ${weightLog.length === 0 ? '<div style="color:var(--tx3);font-size:13px;text-align:center;padding:8px">Sin registros</div>' : ''}
      </div>
    </div>

    <button class="btn btn-primary btn-block" onclick="window.goTab('plans',null)" style="margin:6px 0">
      📋 Gestionar Planes de Entrenamiento
    </button>

    <div class="card">
      <div style="font-size:11px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Datos</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm btn-ghost" style="flex:1" onclick="window.exportData()">📤 Exportar</button>
        <button class="btn btn-sm btn-ghost" style="flex:1" onclick="window.importData()">📥 Importar</button>
        <button class="btn btn-sm btn-ghost" style="flex:1;color:var(--re)" onclick="window.clearAllData()">🗑️</button>
      </div>
    </div>

    <div class="card text-center">
      <button class="btn btn-ghost btn-block" id="installBtn" style="display:none" onclick="window.installApp()">📲 Instalar app</button>
    </div>`;

  scr.classList.add('active');
  const installBtn = document.getElementById('installBtn');
  if (installBtn && window.__deferredPrompt) installBtn.style.display = 'inline-flex';
}

export async function saveProfileField(field, value) {
  const profile = await dbGet('profile', { name: '', gender: 'male', dob: '', height: 175, sport: 'basketball' });
  profile[field] = value;
  if (field === 'height') profile[field] = parseFloat(value) || 175;
  await dbSet('profile', profile);
  renderProfile();
}

export async function saveCurrentWeight() {
  const input = $('weightInput');
  if (!input || !input.value) return;
  const w = parseFloat(input.value);
  if (!w || w <= 0) return;
  const weightLog = await dbGet('weightLog', []);
  weightLog.push({ d: new Date().toISOString().split('T')[0], w });
  await dbSet('weightLog', weightLog);
  input.value = '';
  renderProfile();
}
