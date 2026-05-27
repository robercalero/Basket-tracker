import { $, mk } from '../utils/dom.js';

export const TABS = [
  { id: 'home', icon: '🏠', label: 'Inicio' },
  { id: 'session', icon: '🏋️', label: 'Sesión' },
  { id: 'stats', icon: '📊', label: 'Stats' },
  { id: 'progress', icon: '📈', label: 'Progreso' },
  { id: 'plans', icon: '📋', label: 'Planes' },
  { id: 'profile', icon: '👤', label: 'Perfil' },
];

export function renderNav() {
  const el = $('nav');
  if (!el) return;
  el.className = 'nav';
  el.innerHTML = '';
  const inner = mk('div', 'nav-inner');
  TABS.forEach(t => {
    const btn = mk('button', 'nav-item');
    btn.dataset.tab = t.id;
    btn.innerHTML = `<span class="nav-icon">${t.icon}</span><span class="nav-label">${t.label}</span>`;
    inner.appendChild(btn);
  });
  el.appendChild(inner);
  const syncDot = mk('div', 'sync-indicator');
  syncDot.id = 'syncDot';
  syncDot.title = 'Sin conexión al servidor';
  el.appendChild(syncDot);
}

export function updateNav(activeId) {
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === activeId);
  });
}
