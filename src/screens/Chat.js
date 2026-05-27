import { $, div } from '../utils/dom.js';
import { dbGet } from '../services/storage.js';
import { PLANS } from '../data/plans/index.js';
import { getCurrentWeek } from '../services/planUtils.js';
import { SPORTS } from '../data/sports.js';
import { findActivePlanIdx } from './Plans.js';

const STORAGE_KEY = 'chatHistory';
const MAX_HISTORY = 50;

let messages = [];
let loading = false;
let ctxBuilt = false;

export async function renderChat() {
  const scr = $('chat');
  if (!scr) return;
  scr.innerHTML = '';

  messages = await dbGet(STORAGE_KEY, []);

  if (messages.length === 0) {
    messages.push({
      role: 'ai',
      text: '¡Hola! Soy tu Coach IA especializado en rendimiento deportivo con transferencia al baloncesto 🏀\n\nPuedo ayudarte con:\n\n• **Rutinas personalizadas** para tu deporte y nivel\n• **Análisis de tu progreso** en el gimnasio\n• **Consejos** para transferir tu fuerza a la cancha\n• **Responder dudas** sobre ejercicios, volumen, frecuencia\n\n¿Qué te gustaría mejorar hoy? Cuéntame y te haré las preguntas necesarias para crear el plan perfecto para ti.',
      time: Date.now(),
    });
    await saveMessages();
  }

  scr.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-info">
        <span class="chat-avatar">🤖</span>
        <div>
          <div class="chat-header-name">Coach IA</div>
          <div class="chat-header-status">En línea · Especialista en baloncesto</div>
        </div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="window.clearChat()" title="Nueva conversación">✕</button>
    </div>
    <div class="chat-messages" id="chatMessages">
      ${messages.map(m => renderMessage(m)).join('')}
      ${loading ? '<div class="chat-typing"><span></span><span></span><span></span></div>' : ''}
    </div>
    <div class="chat-input-wrap">
      <textarea class="chat-input" id="chatInput" rows="1" placeholder="Escribe un mensaje..." ${loading ? 'disabled' : ''}></textarea>
      <button class="btn btn-primary chat-send" id="chatSendBtn" onclick="window.sendChatMessage()" ${loading ? 'disabled' : ''}>→</button>
    </div>`;

  scr.classList.add('active');
  scrollToBottom();

  const input = $('chatInput');
  if (input) {
    input.focus();
    input.addEventListener('input', autoResizeInput);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        window.sendChatMessage();
      }
    });
  }
}

function renderMessage(m) {
  const isUser = m.role === 'user';
  const time = m.time ? new Date(m.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
  const text = isUser ? escapeHtml(m.text) : renderMarkdown(m.text);
  return `
    <div class="chat-msg ${isUser ? 'user' : 'ai'}">
      ${!isUser ? '<div class="msg-avatar">🤖</div>' : ''}
      <div class="msg-bubble">
        <div class="msg-text">${text}</div>
        <div class="msg-time">${time}${!isUser && m.source ? ' · <span style="opacity:0.5">' + m.source + '</span>' : ''}</div>
      </div>
    </div>`;
}

function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function autoResizeInput() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
}

async function saveMessages() {
  const toStore = messages.slice(-MAX_HISTORY);
  const { dbSet } = await import('../services/storage.js');
  await dbSet(STORAGE_KEY, toStore);
}

export async function sendMessage() {
  if (loading) return;
  const input = $('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  input.disabled = true;
  $('chatSendBtn')?.setAttribute('disabled', 'true');

  messages.push({ role: 'user', text, time: Date.now() });
  await saveMessages();
  loading = true;
  appendTypingIndicator();
  scrollToBottom();

  try {
    const context = await buildContext();
    const response = await callCoachAPI(messages, context);
    messages.push({ role: 'ai', text: response.content, time: Date.now(), source: response.source || '' });
    loading = false;
    removeTypingIndicator();
    appendMessage(messages[messages.length - 1]);
    await saveMessages();
    scrollToBottom();
  } catch (err) {
    loading = false;
    removeTypingIndicator();
    const errMsg = {
      role: 'ai',
      text: 'Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?',
      time: Date.now(),
      source: 'error',
    };
    messages.push(errMsg);
    appendMessage(errMsg);
    await saveMessages();
    scrollToBottom();
  }

  input.disabled = false;
  input.focus();
  $('chatSendBtn')?.removeAttribute('disabled');
}

function appendTypingIndicator() {
  const container = $('chatMessages');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'chat-typing';
  el.id = 'typingIndicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(el);
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function appendMessage(m) {
  const container = $('chatMessages');
  if (!container) return;
  const el = document.createElement('div');
  el.innerHTML = renderMessage(m);
  container.insertAdjacentHTML('beforeend', el.innerHTML);
}

async function buildContext() {
  if (ctxBuilt) return null;
  ctxBuilt = true;

  const profile = await dbGet('profile', { name: '', sport: 'basketball' });
  const planIdx = await findActivePlanIdx();
  const customPlans = await (await import('../services/customPlans.js')).getCustomPlans();
  const allPlans = [...PLANS, ...customPlans.map(p => ({ ...p, custom: true }))];
  const plan = allPlans[planIdx];
  const sport = SPORTS.find(s => s.id === profile.sport) || SPORTS[0];
  const log = await dbGet('log', []);
  const weightLog = await dbGet('weightLog', []);
  const lastWorkout = log.filter(l => l.ex?.length > 0).slice(-1)[0];
  const totalWorkouts = log.length;

  return {
    profile: {
      name: profile.name || 'Usuario',
      sport: sport.name,
      sportId: profile.sport,
      height: profile.height,
    },
    plan: plan ? {
      name: plan.name,
      goal: plan.goal,
      level: plan.level,
      daysPerWeek: plan.daysPerWeek,
    } : null,
    stats: {
      totalWorkouts,
      totalWeightLogs: weightLog.length,
      lastWorkoutDate: lastWorkout?.d || null,
      lastWorkoutExercises: lastWorkout?.ex?.map(e => ({
        name: e.n,
        sets: e.s,
        weight: e.w,
      })) || [],
    },
  };
}

async function callCoachAPI(msgs, context) {
  const last10Msgs = msgs.slice(-10);
  const payload = {
    messages: last10Msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
    context,
  };

  const resp = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }

  const data = await resp.json();
  return {
    content: data.message?.content || 'No pude procesar tu mensaje. Intenta de nuevo.',
    source: data.source || 'local',
  };
}

window.sendChatMessage = sendMessage;

window.clearChat = async function() {
  if (messages.length <= 1 && messages[0]?.role === 'ai') return;
  messages = [{
    role: 'ai',
    text: '¡Nueva conversación iniciada! ¿En qué puedo ayudarte hoy?',
    time: Date.now(),
  }];
  ctxBuilt = false;
  await saveMessages();
  await renderChat();
};
