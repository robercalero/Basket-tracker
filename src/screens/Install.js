import { $ } from '../utils/dom.js';

export function renderInstall() {
  const scr = $('install');
  if (!scr) return;
  scr.innerHTML = `
    <div class="card install-hero">
      <div class="hero-icon">📲</div>
      <h2>Instalar BasketTracker</h2>
      <p>Instala la app en tu dispositivo para usarla sin conexión y acceder más rápido</p>
    </div>
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cómo instalar en iPhone</div>
      <div class="install-steps">
        <div class="install-step">
          <span class="step-num">1</span>
          <span>Toca el botón <strong>Compartir</strong> <span style="font-size:18px">⎙</span> en Safari</span>
        </div>
        <div class="install-step">
          <span class="step-num">2</span>
          <span>Desplázate y toca <strong>"Añadir a pantalla de inicio"</strong></span>
        </div>
        <div class="install-step">
          <span class="step-num">3</span>
          <span>Toca <strong>"Añadir"</strong> en la esquina superior derecha</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div style="font-size:12px;color:var(--tx2);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cómo instalar en Android</div>
      <div class="install-steps">
        <div class="install-step">
          <span class="step-num">1</span>
          <span>Toca el menú <strong>⋮</strong> en Chrome</span>
        </div>
        <div class="install-step">
          <span class="step-num">2</span>
          <span>Toca <strong>"Instalar app"</strong> o <strong>"Añadir a pantalla de inicio"</strong></span>
        </div>
        <div class="install-step">
          <span class="step-num">3</span>
          <span>Toca <strong>"Instalar"</strong> para confirmar</span>
        </div>
      </div>
    </div>
    <div class="card">
      <p class="text-muted text-center">La app funciona completamente offline una vez instalada</p>
    </div>`;
  scr.classList.add('active');
}
