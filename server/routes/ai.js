const express = require('express');
const router = express.Router();

const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'http://localhost:11434/api/chat';
const LLM_MODEL = process.env.LLM_MODEL || 'llama3';
const IS_OLLAMA = LLM_ENDPOINT.includes('localhost:11434') || LLM_ENDPOINT.includes('ollama');

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

router.post('/ai/coach', async (req, res) => {

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

async function ollamaChat(messages) {
  try {
    const resp = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: LLM_MODEL, messages, stream: false }),
    });

    if (!resp.ok) {
      console.warn('Ollama error:', resp.status, await resp.text());
      return null;
    }

    const data = await resp.json();
    return data.message?.content || null;
  } catch (err) {
    console.warn('Ollama request failed:', err.message);
    return null;
  }
}

function buildSystemPrompt(context) {
  const c = context || {};
  const p = c.profile || {};
  const plan = c.plan || {};
  const stats = c.stats || {};

  return `Eres un entrenador personal experto en rendimiento deportivo con especialización en transferencia del entrenamiento de gimnasio al deporte específico.

## Perfil del usuario
- Nombre: ${p.name || 'Usuario'}
- Deporte: ${p.sport || 'Básquetbol'}
- Altura: ${p.height || 175} cm

## Plan actual
${plan.name ? `- Plan: ${plan.name}\n- Objetivo: ${plan.goal || 'hipertrofia'}\n- Nivel: ${plan.level || 'intermedio'}\n- Días/semana: ${plan.daysPerWeek || 3}` : 'Sin plan activo'}

## Estadísticas
- Total de entrenos: ${stats.totalWorkouts || 0}
${stats.lastWorkoutDate ? `- Último entreno: ${stats.lastWorkoutDate}` : ''}
${stats.lastWorkoutExercises?.length ? `- Últimos ejercicios: ${stats.lastWorkoutExercises.map(e => e.name).join(', ')}` : ''}

## Reglas de interacción
1. Responde SIEMPRE en español, como un coach motivador y conocedor
2. Si el usuario pide una rutina, pregúntale por: nivel, días disponibles, objetivo principal (fuerza/hipertrofia/resistencia), y cualquier limitación
3. Conecta cada recomendación con su transferencia al deporte específico del usuario
4. Si el usuario sube datos de entrenamiento, analízalos y sugiere mejoras concretas
5. Sé conciso: máximo 3-4 párrafos por respuesta
6. Si no tienes suficiente información, haz preguntas específicas en lugar de dar consejos genéricos
7. Usa emojis ocasionalmente para hacer la conversación más amena`;
}

router.post('/ai/chat', async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: { content: 'Envíame un mensaje para poder ayudarte.' }, source: 'local' });
  }

  try {
    const systemPrompt = buildSystemPrompt(context);
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    let content = null;
    let source = 'local';

    // Try Ollama first (if configured)
    if (IS_OLLAMA) {
      content = await ollamaChat(fullMessages);
      source = 'ollama';
    } else if (LLM_API_KEY) {
      // Try OpenAI-compatible
      content = await llmChat(fullMessages);
      source = 'llm';
    }

    // Fallback to local
    if (!content) {
      content = localChatReply(messages, context);
      source = 'local';
    }

    res.json({ message: { role: 'assistant', content }, source });
  } catch (err) {
    console.error('Chat error:', err.message);
    const fallback = localChatReply(messages, context);
    res.json({ message: { role: 'assistant', content: fallback }, source: 'error' });
  }
});

async function llmChat(messages) {
  try {
    const resp = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({ model: LLM_MODEL, messages, max_tokens: 500, temperature: 0.7 }),
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

function localChatReply(messages, context) {
  const lastMsg = messages.filter(m => m.role === 'user').pop();
  const query = lastMsg?.content?.toLowerCase() || '';
  const c = context || {};
  const sport = c.profile?.sport || 'básquetbol';
  const sportId = c.profile?.sportId || 'basketball';

  if (query.includes('rutina') || query.includes('plan') || query.includes('entrenamiento')) {
    return `¡Genial que quieras mejorar tu entrenamiento para ${sport}! 🎯

Para crear una rutina personalizada que transfiera al ${sport}, necesito saber:

1️⃣ **Nivel de experiencia** — ¿Principiante, intermedio o avanzado?
2️⃣ **Días disponibles** — ¿Cuántos días puedes entrenar a la semana?
3️⃣ **Objetivo principal** — ¿Buscas fuerza, hipertrofia o resistencia?
4️⃣ **Equipo disponible** — ¿Tienes acceso a barra, mancuernas, poleas?

Cuéntame esto y te armo un plan perfecto para ti.`;
  }

  if (query.includes('salto') || query.includes('vertical') || query.includes('saltar')) {
    return `Para mejorar tu salto vertical para ${sport}, enfócate en: ⬆️

**Ejercicios clave:**
• Sentadilla con Barra — base de potencia de piernas
• Peso Muerto — cadena posterior completa
• Elevación de Talones — empuje final

**Recomendación:** Trabaja en rangos de 3-5 reps con 80-90% de tu 1RM para desarrollar potencia explosiva. Complementa con ejercicios pliométricos como saltos al cajón.

¿Quieres que te detalle una rutina completa?`;
  }

  if (query.includes('progreso') || query.includes('cómo voy') || query.includes('evolución')) {
    const total = c.stats?.totalWorkouts || 0;
    if (total === 0) {
      return `Aún no tienes entrenos registrados. ¡Empieza tu primera sesión y vuelve para ver tu evolución! 💪`;
    }
    return `Llevas **${total} entrenos** registrados. 💪

Para darte un análisis más preciso, ¿qué ejercicio te gustaría revisar? Puedo decirte si estás progresando, estancado o necesitas cambiar algo.

También puedes contarme cómo te sientes: ¿has notado mejoras en tu rendimiento en la cancha?`;
  }

  return `Hola! Soy tu coach para ${sport} 🏀

Puedo ayudarte a:
• Crear rutinas de gimnasio con transferencia a tu deporte
• Analizar tu progreso y sugerir mejoras
• Recomendar ejercicios específicos para tus objetivos

¿Qué te gustaría trabajar hoy?`;
}

router.post('/ai/generate-plan', async (req, res) => {
  const { sport, goal, level, daysPerWeek } = req.body;

  const sportId = sport || 'general';

  try {
    let plan = await llmGeneratePlan({ sport: sportId, goal, level, daysPerWeek });

    if (!plan) {
      plan = localGeneratePlan({ sport: sportId, goal, level, daysPerWeek });
    }

    res.json({ plan, source: plan.source || 'local', sport: sportId });
  } catch (err) {
    console.error('Plan generation error:', err.message);
    const fallback = localGeneratePlan({ sport: sportId, goal, level, daysPerWeek });
    res.json({ plan: fallback, source: 'local', sport: sportId });
  }
});

async function llmGeneratePlan({ sport, goal, level, daysPerWeek }) {
  if (!LLM_API_KEY) return null;

  const sportInfo = SPORTS[sport] || SPORTS.general;
  const days = daysPerWeek || 3;
  const lvl = level || 'intermediate';
  const g = goal || 'hypertrophy';

  const messages = [
    {
      role: 'system',
      content: `Eres un entrenador personal experto en crear planes de entrenamiento personalizados para deportes específicos.

Genera un plan de entrenamiento en formato JSON exacto (sin markdown, sin explicaciones).

Deporte: ${sportInfo.name}
Atributos: ${sportInfo.attributes}
Nivel: ${lvl}
Objetivo: ${g}
Días por semana: ${days}

Formato JSON requerido:
{
  "name": "Nombre del plan",
  "desc": "Descripción breve",
  "weeks": [{
    "label": "Semana 1",
    "phase": "custom",
    "days": [
      [
        { "name": "Nombre Ejercicio", "sets": 3, "reps": "8-12", "rir": 1, "rest": 90 },
        ...
      ]
    ]
  }]
}

Reglas:
- ${days} días de entrenamiento
- Ejercicios apropiados para ${sportInfo.name} que transfieran a ${sportInfo.attributes}
- ${g === 'strength' ? '4-5 sets, 4-6 reps, descanso 120-180s' : g === 'endurance' ? '3 sets, 15-20 reps, descanso 30-60s' : '3-4 sets, 8-12 reps, descanso 60-90s'}
- ${lvl === 'beginner' ? '3-4 ejercicios por día, menor volumen' : lvl === 'advanced' ? '6-8 ejercicios por día, mayor intensidad' : '5-6 ejercicios por día'}
- Nombres de ejercicios en español
- Incluir ejercicios compuestos + aislados
- NO incluir markdown ni texto fuera del JSON`,
    },
    {
      role: 'user',
      content: `Crea un plan de ${days} días para ${sportInfo.name} nivel ${lvl} con objetivo ${g}.`,
    },
  ];

  try {
    const resp = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({ model: LLM_MODEL, messages, max_tokens: 1500, temperature: 0.7 }),
    });

    if (!resp.ok) {
      console.warn('LLM generate-plan error:', resp.status);
      return null;
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const generated = JSON.parse(jsonMatch[0]);
    return {
      name: generated.name || `Plan ${sportInfo.name}`,
      emoji: '🤖',
      desc: generated.desc || `Plan generado por IA`,
      level: lvl,
      goal: g,
      daysPerWeek: days,
      recommendedSports: [sport],
      weeks: generated.weeks || [],
      source: 'llm',
    };
  } catch (err) {
    console.warn('LLM generate-plan failed:', err.message);
    return null;
  }
}

function localGeneratePlan({ sport, goal, level, daysPerWeek }) {
  const dayNames = {
    2: ['Upper', 'Lower'],
    3: ['Full Body A', 'Full Body B', 'Full Body C'],
    4: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
    5: ['Empuje', 'Tirón', 'Piernas', 'Hombros', 'Brazos'],
    6: ['Empuje A', 'Tirón A', 'Piernas A', 'Empuje B', 'Tirón B', 'Piernas B'],
  };

  const exercisePool = {
    basketball: ['Sentadilla con Barra', 'Peso Muerto', 'Peso Muerto Rumano', 'Press Banca Plano', 'Press Hombro con Barra', 'Remo con Barra', 'Zancadas', 'Elevación de Talones', 'Plancha con Lastre', 'Ab Wheel (Rueda)', 'Curl con Barra', 'Extensión Tríceps en Polea', 'Face Pull', 'Elevaciones Laterales', 'Sentadilla Búlgara'],
    football: ['Sentadilla con Barra', 'Peso Muerto', 'Peso Muerto Rumano', 'Zancadas', 'Prensa de Piernas', 'Plancha con Lastre', 'Remo con Barra', 'Press Hombro con Barra', 'Curl con Barra', 'Elevación de Talones', 'Extensión Tríceps en Polea'],
    running: ['Peso Muerto Rumano', 'Sentadilla con Barra', 'Prensa de Piernas', 'Curl Femoral', 'Plancha con Lastre', 'Elevación de Talones', 'Remo con Barra', 'Zancadas'],
    tennis: ['Peso Muerto Rumano', 'Zancadas', 'Sentadilla con Barra', 'Remo con Barra', 'Press Hombro con Barra', 'Plancha con Lastre', 'Extensión Tríceps en Polea', 'Curl con Barra', 'Ab Wheel (Rueda)', 'Elevaciones Laterales'],
    crossfit: ['Sentadilla con Barra', 'Peso Muerto', 'Press Hombro con Barra', 'Remo con Barra', 'Plancha con Lastre', 'Zancadas', 'Flexiones', 'Burpees', 'Kettlebell Swing'],
    general: ['Press Banca Plano', 'Remo con Barra', 'Sentadilla con Barra', 'Press Hombro con Barra', 'Peso Muerto Rumano', 'Jalón en Polea Alta', 'Curl con Barra', 'Extensión Tríceps en Polea', 'Elevaciones Laterales', 'Prensa de Piernas', 'Curl Femoral', 'Plancha', 'Face Pull', 'Elevación de Talones'],
  };

  const g = goal || 'hypertrophy';
  const lvl = level || 'intermediate';
  const days = daysPerWeek || 3;
  const pool = exercisePool[sport] || exercisePool.general;

  const repScheme = g === 'strength' ? { main: '4-6', secondary: '6-8', rest: 150 }
    : g === 'endurance' ? { main: '15-20', secondary: '20-25', rest: 45 }
    : { main: '8-12', secondary: '12-15', rest: 90 };

  const setsBase = g === 'strength' ? 4 : 3;
  const sets = lvl === 'beginner' ? Math.max(setsBase - 1, 2) : lvl === 'advanced' ? setsBase + 1 : setsBase;

  function shufflePool() {
    const a = [...pool];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeDay(exNames, isSecondary) {
    const dayExercises = exNames.map((name, i) => ({
      name,
      sets,
      reps: i < 4 ? repScheme.main : repScheme.secondary,
      rir: i < 4 ? 1 : 0,
      rest: repScheme.rest,
    }));
    return { label: '', exercises: dayExercises };
  }

  const shuffled = shufflePool();
  const exercisesPerDay = lvl === 'beginner' ? 4 : lvl === 'advanced' ? 7 : 5;
  const totalNeeded = days * exercisesPerDay;

  const allExercises = [];
  while (allExercises.length < totalNeeded) {
    allExercises.push(...shuffled);
  }

  const weekDays = [];
  for (let d = 0; d < days; d++) {
    const start = d * exercisesPerDay;
    const dayExs = allExercises.slice(start, start + exercisesPerDay);
    weekDays.push(makeDay(dayExs));
  }

  return {
    name: `Plan ${SPORTS[sport]?.name || 'Personalizado'} ${g.charAt(0).toUpperCase() + g.slice(1)}`,
    emoji: '🤖',
    desc: `Generado por IA local para ${SPORTS[sport]?.name || 'General'}. ${g === 'strength' ? 'Fuerza' : g === 'endurance' ? 'Resistencia' : 'Hipertrofia'} - ${days}d/sem`,
    level: lvl,
    goal: g,
    daysPerWeek: days,
    recommendedSports: [sport],
    weeks: [{
      label: 'Semana 1',
      phase: 'custom',
      days: weekDays.map(d => d.exercises),
    }],
    source: 'local',
  };
}

module.exports = router;
