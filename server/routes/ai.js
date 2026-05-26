const express = require('express');
const router = express.Router();
const { requireDB } = require('../middleware');

const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

const SPORTS = {
  basketball: {
    name: 'Básquetbol',
    attributes: 'salto vertical, potencia explosiva, agilidad lateral, velocidad, core estable, resistencia y fuerza funcional',
    context: 'El usuario entrena en el gimnasio para rendir mejor en la cancha de básquetbol. Conecta cada ejercicio con su transferencia al juego real: saltos, rebotes, defensa, cambios de dirección, protección del balón y tiro.',
  },
  football: {
    name: 'Fútbol',
    attributes: 'velocidad, potencia explosiva, agilidad, resistencia, core estable y fuerza funcional',
    context: 'El usuario entrena en el gimnasio para rendir mejor en el campo de fútbol. Conecta cada ejercicio con su transferencia al juego real: sprints, golpeo, duelos, cambios de dirección y protección del balón.',
  },
  running: {
    name: 'Running',
    attributes: 'resistencia, velocidad, core estable y fuerza resistencia',
    context: 'El usuario entrena en el gimnasio para mejorar su rendimiento corriendo. Conecta cada ejercicio con su transferencia a la carrera: economía de zancada, prevención de lesiones y fuerza en cuestas.',
  },
  tennis: {
    name: 'Tenis',
    attributes: 'potencia explosiva, desplazamiento lateral, rotación de core y resistencia',
    context: 'El usuario entrena en el gimnasio para rendir mejor en la pista de tenis. Conecta cada ejercicio con su transferencia al juego real: saque, golpes de fondo, desplazamientos laterales y prevención de lesiones.',
  },
  crossfit: {
    name: 'CrossFit',
    attributes: 'fuerza general, resistencia metabólica, potencia y core',
    context: 'El usuario entrena para rendir en CrossFit. Conecta cada ejercicio con su aplicación en WODs: levantamientos olímpicos, gimnásticos y trabajo metabólico.',
  },
  general: {
    name: 'General',
    attributes: 'fuerza, hipertrofia y resistencia',
    context: 'El usuario entrena con objetivos generales de fitness. Proporciona recomendaciones estándar de fuerza, hipertrofia y acondicionamiento.',
  },
};

function getSportInfo(sportId) {
  return SPORTS[sportId] || SPORTS.basketball;
}

function localAdvice(exerciseLog, query, sportId) {
  const lines = [];
  const sport = getSportInfo(sportId);

  if (!exerciseLog || exerciseLog.length === 0) {
    return `Aún no tienes datos registrados. Completa algunos entrenamientos para recibir recomendaciones personalizadas para ${sport.name}.`;
  }

  for (const ex of exerciseLog) {
    const sets = ex.sets || [];
    if (sets.length < 2) continue;

    const last = sets[sets.length - 1];
    const prev = sets[sets.length - 2];

    if (last.w > prev.w && prev.w > 0) {
      const pct = ((last.w - prev.w) / prev.w * 100).toFixed(1);
      lines.push(`• ${ex.n}: subiste de ${prev.w}kg a ${last.w}kg (+${pct}%) — buen progreso.`);
    } else if (last.w === prev.w && prev.w > 0) {
      let streak = 1;
      for (let i = sets.length - 1; i > 0 && sets[i].w === sets[i - 1].w; i--) streak++;
      if (streak >= 3) {
        const nextW = Math.round((last.w + 1.25) * 100) / 100;
        lines.push(`• ${ex.n}: ${streak} sesiones con ${last.w}kg. Prueba subir a ${nextW}kg.`);
      } else {
        lines.push(`• ${ex.n}: mantienes ${last.w}kg con ${last.r || '?'} reps. Busca alcanzar el tope del rango de reps antes de subir.`);
      }
    }

    if (Number(last.r) && Number(prev.r) && Number(last.r) > Number(prev.r) && last.w >= prev.w) {
      lines.push(`• ${ex.n}: más reps (${prev.r} → ${last.r}) con mismo peso — mejora tu resistencia muscular.`);
    }
  }

  if (lines.length === 0) {
    return `Sigue entrenando consistentemente para ${sport.name}. En unas semanas tendré datos suficientes para darte recomendaciones más precisas y específicas para tu deporte.`;
  }

  return lines.join('\n');
}

async function llmAdvice(exerciseLog, query, sportId) {
  if (!LLM_API_KEY) return null;

  const sport = getSportInfo(sportId);

  const context = exerciseLog.slice(-5).map(ex => {
    const sets = (ex.sets || []).slice(-3).map(s => `${s.w}kg x ${s.r || '?'} reps${s.wu ? ' (calentamiento)' : ''}`).join(', ');
    return `${ex.n}: ${ex.s || 0} sets completados — ${sets}`;
  }).join('\n');

  const messages = [
    {
      role: 'system',
      content: `Eres un entrenador personal experto en rendimiento deportivo con especialización en transferencia del entrenamiento de gimnasio al deporte específico.

Deporte del usuario: **${sport.name}**
Atributos clave: ${sport.attributes}

${sport.context}

Formato de respuesta:
1. Análisis del progreso actual en el gimnasio
2. Transferencia específica al ${sport.name}: cómo cada mejora en el gym impacta en el rendimiento deportivo
3. Recomendaciones prácticas para la próxima sesión

Responde en español. Máximo 3 párrafos. Sé conciso, específico y motivador.`,
    },
    {
      role: 'user',
      content: `Datos de mis últimos entrenamientos para ${sport.name}:\n${context || '(sin datos)'}\n\nMi consulta: ${query || `¿Cómo puedo transferir mi progreso del gym a mi rendimiento en ${sport.name}?`}`,
    },
  ];

  try {
    const resp = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      console.warn('LLM API error:', resp.status, await resp.text());
      return null;
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('LLM request failed:', err.message);
    return null;
  }
}

router.post('/ai/coach', requireDB, async (req, res) => {

  const { exerciseLog, query, sport } = req.body;
  const sportId = sport || 'basketball';

  try {
    let advice = await llmAdvice(exerciseLog || [], query || '', sportId);
    let source = 'llm';

    if (!advice) {
      advice = localAdvice(exerciseLog || [], query || '', sportId);
      source = 'local';
    }

    res.json({ advice, source, sport: sportId });
  } catch (err) {
    res.status(500).json({
      advice: 'Error al generar recomendaciones. Intenta de nuevo más tarde.',
      source: 'error',
    });
  }
});

module.exports = router;
