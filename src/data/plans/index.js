export const PLANS = [
  // ============================================================
  // 1. PUSH PULL LEGS - Clásico
  // ============================================================
  {
    id: 'ppl',
    name: 'Push Pull Legs',
    emoji: '💪',
    desc: 'Clásico PPL: 6 días / semana. Empuje, tirón y piernas.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 6,
    weeks: [
      {
        label: 'Semana 1-3 (Fuerza)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Hombro con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Mancuernas Inclinado', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '30s', rir: 1 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Jalón en Polea Alta', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Mancuernas Plano', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '10-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Dominada con Lastre', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Remo T', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Pajar Laterales', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Concentrado', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Encogimientos con Barra', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Peso Muerto', sets: 3, reps: '5-6', rir: 1, rest: 120 },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '30s', rir: 1, rest: 60 },
        ]],
      },
      {
        label: 'Semana 4-6 (Hipertrofia)',
        phase: 'hypertrophy',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Press Mancuernas Inclinado', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Aperturas en Polea', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Plancha con Lastre', sets: 3, reps: '45s', rir: 0, rest: 45 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '20-25', rir: 0, rest: 45 },
          { name: 'Curl con Barra', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Curl Martillo', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '20', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Prensa de Piernas', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Curl Femoral', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Elevación de Talones', sets: 4, reps: '20-25', rir: 0, rest: 45 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '20', rir: 0, rest: 45 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Press Mancuernas Plano', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Fondos en Banco', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '20', rir: 0, rest: 45 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Dominada', sets: 4, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Remo T', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Pajar en Polea', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Curl Martillo', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Encogimientos con Mancuernas', sets: 3, reps: '20', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Peso Muerto', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Hip Thrust', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Curl Femoral', sets: 3, reps: '15-20', rir: 0, rest: 45 },
          { name: 'Plancha', sets: 3, reps: '60s', rir: 0, rest: 45 },
        ]],
      },
    ],
  },

  // ============================================================
  // 2. TORSO PIERNA
  // ============================================================
  {
    id: 'torso-pierna',
    name: 'Torso Pierna',
    emoji: '🏋️',
    desc: 'División Torso / Pierna 4-6 días/semana. Máximo volumen.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Hipertrofia)',
        phase: 'hypertrophy',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Press Mancuernas Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Dominada con Lastre', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Encogimientos con Barra', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto', sets: 3, reps: '5-6', rir: 1, rest: 120 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 3. WEIDER PRO
  // ============================================================
  {
    id: 'weider-pro',
    name: 'Weider Pro',
    emoji: '🏆',
    desc: 'Weider clásico: pecho+hombro+tríceps, espalda+bíceps, pierna.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 6,
    weeks: [
      {
        label: 'Semana 1-6 (Volumen)',
        phase: 'volume',
        days: [[
          { name: 'Press Banca Plano', sets: 5, reps: '6-10', rir: 1, rest: 120 },
          { name: 'Press Hombro con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Mancuernas Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 1, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 5, reps: '6-10', rir: 1, rest: 120 },
          { name: 'Jalón en Polea Alta', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl con Barra', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Encogimientos con Barra', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '6-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '30s', rir: 1, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 4. PUSH PULL LEGS 2 (Alta frecuencia)
  // ============================================================
  {
    id: 'ppl2',
    name: 'Push Pull Legs 2',
    emoji: '⚡',
    desc: 'PPL de alta frecuencia. Sesiones de 45-60 min con series compuestas.',
    level: 'advanced',
    goal: 'strength',
    daysPerWeek: 6,
    weeks: [
      {
        label: 'Semana 1-3 (Fuerza)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '5-8', rir: 1, rest: 120 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Inclinado', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Fondos con Lastre', sets: 3, reps: '8-12', rir: 0, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '30s', rir: 1, rest: 60 },
        ], [
          { name: 'Dominada con Lastre', sets: 4, reps: '5-8', rir: 1, rest: 120 },
          { name: 'Remo con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Curl con Barra Z', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Inclinado', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '5-8', rir: 1, rest: 120 },
          { name: 'Peso Muerto', sets: 3, reps: '5-6', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Mancuernas Plano', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Dominada', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo T', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Pajar en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Encogimientos con Mancuernas', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ]],
      },
      {
        label: 'Semana 4-6 (Intensidad)',
        phase: 'intensity',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '3-5', rir: 0, rest: 150 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '6-8', rir: 0, rest: 120 },
          { name: 'Press Banca Inclinado', sets: 3, reps: '6-8', rir: 0, rest: 120 },
          { name: 'Fondos con Lastre', sets: 3, reps: '6-10', rir: 0, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '12', rir: 0, rest: 45 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '10-12', rir: 0, rest: 45 },
          { name: 'Plancha con Lastre', sets: 3, reps: '20s', rir: 0, rest: 45 },
        ], [
          { name: 'Dominada con Lastre', sets: 4, reps: '3-5', rir: 0, rest: 150 },
          { name: 'Remo con Barra', sets: 4, reps: '4-6', rir: 0, rest: 150 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Curl con Barra Z', sets: 3, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Curl Inclinado', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '12-15', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 3, reps: '3-5', rir: 0, rest: 180 },
          { name: 'Prensa de Piernas', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '12', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '4-6', rir: 0, rest: 150 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '5-6', rir: 0, rest: 120 },
          { name: 'Press Mancuernas Plano', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '10-12', rir: 0, rest: 45 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '12', rir: 0, rest: 45 },
          { name: 'Fondos en Banco', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '10-12', rir: 0, rest: 45 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '4-6', rir: 0, rest: 150 },
          { name: 'Dominada con Lastre', sets: 4, reps: '6-8', rir: 0, rest: 120 },
          { name: 'Remo T', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Pajar en Polea', sets: 3, reps: '10-12', rir: 0, rest: 45 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Encogimientos con Mancuernas', sets: 3, reps: '12', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '4-6', rir: 0, rest: 180 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '6-8', rir: 0, rest: 120 },
          { name: 'Hip Thrust', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 45 },
        ]],
      },
    ],
  },

  // ============================================================
  // 5. CUERPO COMPLETO (Full Body)
  // ============================================================
  {
    id: 'fullbody',
    name: 'Cuerpo Completo',
    emoji: '🔥',
    desc: 'Full Body 3x/semana. Ideal para agendas apretadas o principiantes.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Adaptación)',
        phase: 'adaptation',
        days: [[
          { name: 'Sentadilla con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Plano', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Peso Muerto Rumano', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Plano', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Peso Muerto Rumano', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Plano', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Peso Muerto Rumano', sets: 2, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 6. PRINCIPIANTE FULL BODY (Máquinas)
  // ============================================================
  {
    id: 'beginner-fullbody-machine',
    name: 'Full Body Principiante',
    emoji: '🌱',
    desc: 'Full Body 3x en máquinas. Perfecto para empezar.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Fundamentos)',
        phase: 'adaptation',
        days: [[
          { name: 'Press en Máquina de Pecho', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Remo en Polea Baja', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Press Hombro en Máquina', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Prensa de Piernas', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Máquina', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '20s', rir: 0, rest: 60 },
        ], [
          { name: 'Press en Máquina de Pecho', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Remo en Polea Baja', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Press Hombro en Máquina', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Prensa de Piernas', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Máquina', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '20s', rir: 0, rest: 60 },
        ], [
          { name: 'Press en Máquina de Pecho', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Remo en Polea Baja', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Press Hombro en Máquina', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Prensa de Piernas', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Curl Máquina', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '20s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 7. 5/3/1 WENDLER (Fuerza Avanzada)
  // ============================================================
  {
    id: '531-wendler',
    name: '5/3/1 Wendler',
    emoji: '🏅',
    desc: 'Programa de fuerza 4x/semana. Progresión probada.',
    level: 'advanced',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Ciclo 1)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Barra', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Dominada', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Peso Muerto', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Sentadilla Frontal', sets: 3, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 4, reps: '15-20', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 8. PHUL (Power Hypertrophy Upper Lower)
  // ============================================================
  {
    id: 'phul',
    name: 'PHUL',
    emoji: '💥',
    desc: 'Upper/Lower 4x. Combina fuerza e hipertrofia.',
    level: 'intermediate',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '3-5', rir: 1, rest: 150 },
          { name: 'Remo con Barra', sets: 4, reps: '3-5', rir: 1, rest: 150 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '6-8', rir: 1, rest: 90 },
          { name: 'Dominada con Lastre', sets: 3, reps: '6-8', rir: 1, rest: 90 },
          { name: 'Curl con Barra', sets: 3, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '8-10', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 4, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Prensa de Piernas', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla Frontal', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 4, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 9. FUERZA 5x5
  // ============================================================
  {
    id: '5x5-strength',
    name: 'Fuerza 5x5',
    emoji: '🦍',
    desc: '5 series de 5 reps. El clásico de fuerza. 3x/semana.',
    level: 'beginner',
    goal: 'strength',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Lineal)',
        phase: 'strength',
        days: [[
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 1, rest: 180 },
          { name: 'Press Banca Plano', sets: 5, reps: '5', rir: 1, rest: 150 },
          { name: 'Remo con Barra', sets: 5, reps: '5', rir: 1, rest: 150 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 1, rest: 180 },
          { name: 'Press Hombro con Barra', sets: 5, reps: '5', rir: 1, rest: 150 },
          { name: 'Peso Muerto', sets: 5, reps: '5', rir: 1, rest: 180 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 1, rest: 180 },
          { name: 'Press Banca Plano', sets: 5, reps: '5', rir: 1, rest: 150 },
          { name: 'Remo con Barra', sets: 5, reps: '5', rir: 1, rest: 150 },
        ]],
      },
    ],
  },

  // ============================================================
  // 10. CARDIO / RESISTENCIA
  // ============================================================
  {
    id: 'cardio-endurance',
    name: 'Cardio Resistencia',
    emoji: '🏃',
    desc: 'Circuito metabólico 3-4x/semana para quemar grasa y fondo.',
    level: 'beginner',
    goal: 'endurance',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Resistencia)',
        phase: 'endurance',
        days: [[
          { name: 'Flexiones', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Sentadilla Aire', sets: 3, reps: '20', rir: 0, rest: 30 },
          { name: 'Remo en Polea Baja', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Crunches', sets: 3, reps: '20', rir: 0, rest: 30 },
          { name: 'Elevación de Talones', sets: 3, reps: '20', rir: 0, rest: 30 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 30 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '12-15', rir: 0, rest: 30 },
        ], [
          { name: 'Press Mancuernas Plano', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '12', rir: 0, rest: 30 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Russian Twist', sets: 3, reps: '20', rir: 0, rest: 30 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 30 },
          { name: 'Curl con Barra', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Fondos en Banco', sets: 3, reps: '12-15', rir: 0, rest: 30 },
        ], [
          { name: 'Flexiones', sets: 3, reps: '15-20', rir: 0, rest: 30 },
          { name: 'Sentadilla Goblet', sets: 3, reps: '15', rir: 0, rest: 30 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '12-15', rir: 0, rest: 30 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '12', rir: 0, rest: 30 },
          { name: 'Hip Thrust', sets: 3, reps: '15', rir: 0, rest: 30 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 30 },
          { name: 'Curl Martillo', sets: 3, reps: '15', rir: 0, rest: 30 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '15', rir: 0, rest: 30 },
        ]],
      },
    ],
  },

  // ============================================================
  // 11. PUSH PULL LEGS - Principiante (3 días)
  // ============================================================
  {
    id: 'ppl-beginner',
    name: 'PPL Principiante',
    emoji: '🌱',
    desc: 'Push/Pull/Legs 3x/semana. Versión simplificada para empezar.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Fundamentos)',
        phase: 'adaptation',
        days: [[
          { name: 'Press Banca Plano', sets: 3, reps: '8-12', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '8-12', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 2, reps: '15', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 3, reps: '8-12', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '8-12', rir: 1, rest: 90 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 2, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 3, reps: '8-12', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 2, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 12. UPPER / LOWER (4 días)
  // ============================================================
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    emoji: '💪',
    desc: 'Upper/Lower 4x/semana. Equilibrio entre fuerza y volumen.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Hipertrofia)',
        phase: 'hypertrophy',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Dominada con Lastre', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla Frontal', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto', sets: 3, reps: '5-6', rir: 1, rest: 180 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 13. ARNOLD SPLIT (6 días)
  // ============================================================
  {
    id: 'arnold-split',
    name: 'Arnold Split',
    emoji: '👑',
    desc: 'Pecho+Espalda / Hombro+Brazo / Pierna. El clásico de Arnold.',
    level: 'advanced',
    goal: 'hypertrophy',
    daysPerWeek: 6,
    weeks: [
      {
        label: 'Semana 1-4 (Volumen)',
        phase: 'volume',
        days: [[
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl con Barra Z', sets: 4, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 4, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Press Mancuernas Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Dominada con Lastre', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Mancuernas Plano', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Remo T', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Pajar en Polea', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Curl en Polea Baja', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Concentrado', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto', sets: 3, reps: '5-6', rir: 1, rest: 180 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Hip Thrust', sets: 3, reps: '12-15', rir: 0, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 3, reps: '20', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 14. BRO SPLIT (5 días)
  // ============================================================
  {
    id: 'bro-split',
    name: 'Bro Split',
    emoji: '🦾',
    desc: 'Pecho / Espalda / Hombro / Pierna / Brazo. 5 días clásico.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 5,
    weeks: [
      {
        label: 'Semana 1-4 (Volumen)',
        phase: 'volume',
        days: [[
          { name: 'Press Banca Plano', sets: 5, reps: '6-10', rir: 1, rest: 120 },
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Mancuernas Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Flexiones Lastre', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 5, reps: '6-10', rir: 1, rest: 120 },
          { name: 'Dominada con Lastre', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Remo T', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Encogimientos con Barra', sets: 4, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 5, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 4, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Pajar Laterales', sets: 3, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Curl con Barra', sets: 4, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 4, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 15. POWERBUILDING (Fuerza + Hipertrofia)
  // ============================================================
  {
    id: 'powerbuilding',
    name: 'Powerbuilding',
    emoji: '⚡',
    desc: 'Fuerza en compuestos, volumen en aislados. 4x/semana.',
    level: 'intermediate',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Fuerza + Volumen)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 5, reps: '5', rir: 1, rest: 150 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '6-8', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 4, reps: '5', rir: 1, rest: 180 },
          { name: 'Prensa de Piernas', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Press Hombro con Barra', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Dominada con Lastre', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla Frontal', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 16. STRONGLIFTS 5x5
  // ============================================================
  {
    id: 'stronglifts',
    name: 'StrongLifts 5x5',
    emoji: '🏋️',
    desc: '5x5 clásico. 3x/semana. Progresión lineal de fuerza.',
    level: 'beginner',
    goal: 'strength',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-8 (Lineal)',
        phase: 'strength',
        days: [[
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Banca Plano', sets: 5, reps: '5', rir: 0, rest: 150 },
          { name: 'Remo con Barra', sets: 5, reps: '5', rir: 0, rest: 150 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Hombro con Barra', sets: 5, reps: '5', rir: 0, rest: 150 },
          { name: 'Peso Muerto', sets: 5, reps: '5', rir: 0, rest: 180 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Banca Plano', sets: 5, reps: '5', rir: 0, rest: 150 },
          { name: 'Remo con Barra', sets: 5, reps: '5', rir: 0, rest: 150 },
        ]],
      },
    ],
  },

  // ============================================================
  // 17. STARTING STRENGTH
  // ============================================================
  {
    id: 'starting-strength',
    name: 'Starting Strength',
    emoji: '🎯',
    desc: 'Programa novato de Rippetoe. 3x/semana. Fuerza básica.',
    level: 'beginner',
    goal: 'strength',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-12 (Novato)',
        phase: 'strength',
        days: [[
          { name: 'Sentadilla con Barra', sets: 3, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Banca Plano', sets: 3, reps: '5', rir: 0, rest: 150 },
          { name: 'Peso Muerto', sets: 1, reps: '5', rir: 0, rest: 180 },
          { name: 'Dominada', sets: 3, reps: 'al fallo', rir: 0, rest: 90 },
        ], [
          { name: 'Sentadilla con Barra', sets: 3, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Hombro con Barra', sets: 3, reps: '5', rir: 0, rest: 150 },
          { name: 'Peso Muerto Rumano', sets: 3, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Dominada', sets: 3, reps: 'al fallo', rir: 0, rest: 90 },
        ], [
          { name: 'Sentadilla con Barra', sets: 3, reps: '5', rir: 0, rest: 180 },
          { name: 'Press Banca Plano', sets: 3, reps: '5', rir: 0, rest: 150 },
          { name: 'Peso Muerto', sets: 1, reps: '5', rir: 0, rest: 180 },
          { name: 'Dominada', sets: 3, reps: 'al fallo', rir: 0, rest: 90 },
        ]],
      },
    ],
  },

  // ============================================================
  // 18. GVT (GERMAN VOLUME TRAINING) 10x10
  // ============================================================
  {
    id: 'gvt',
    name: 'GVT 10x10',
    emoji: '💀',
    desc: '10 series de 10 reps. Volumen extremo para hipertrofia.',
    level: 'advanced',
    goal: 'hypertrophy',
    daysPerWeek: 5,
    weeks: [
      {
        label: 'Semana 1-6 (Volumen Extremo)',
        phase: 'volume',
        days: [[
          { name: 'Press Banca Plano', sets: 10, reps: '10', rir: 0, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 10, reps: '10', rir: 0, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 5, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 10, reps: '10', rir: 0, rest: 90 },
          { name: 'Dominada con Lastre', sets: 5, reps: '10', rir: 0, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl con Barra', sets: 5, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 10, reps: '10', rir: 0, rest: 120 },
          { name: 'Prensa de Piernas', sets: 5, reps: '15', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 5, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Press Mancuernas Inclinado', sets: 10, reps: '10', rir: 0, rest: 90 },
          { name: 'Press Hombro con Barra', sets: 5, reps: '10', rir: 0, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 5, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Peso Muerto Rumano', sets: 5, reps: '10', rir: 0, rest: 120 },
          { name: 'Remo T', sets: 5, reps: '10', rir: 0, rest: 90 },
          { name: 'Curl Martillo', sets: 5, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 5, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 5, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 19. DUMBBELL ONLY (Casa)
  // ============================================================
  {
    id: 'dumbbell-only',
    name: 'Dumbbell Only',
    emoji: '🏠',
    desc: 'Rutina completa solo con mancuernas. 4x/semana en casa.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Adaptación)',
        phase: 'adaptation',
        days: [[
          { name: 'Press Mancuernas Plano', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Extensión Tríceps Mancuerna', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Plancha', sets: 3, reps: '30s', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla Manc.', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Peso Muerto Manc.', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Estocadas Manc.', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Elevación de Talones', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Curl Femoral Manc.', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '12', rir: 0, rest: 45 },
        ], [
          { name: 'Press Mancuernas Inclinado', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Remo Manc. 2 Manos', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '15', rir: 0, rest: 45 },
          { name: 'Curl Manc. Sentado', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Extensión Tríceps Mancuerna', sets: 3, reps: '12-15', rir: 0, rest: 45 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla Goblet', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 60 },
          { name: 'Hip Thrust Manc.', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Elevación de Talones', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Russian Twist Manc.', sets: 3, reps: '15', rir: 0, rest: 45 },
          { name: 'Curl Concentrado', sets: 3, reps: '12-15', rir: 0, rest: 45 },
        ]],
      },
    ],
  },

  // ============================================================
  // 20. BODYWEIGHT (Sin equipo)
  // ============================================================
  {
    id: 'bodyweight',
    name: 'Bodyweight',
    emoji: '🦍',
    desc: 'Calistenia: solo peso corporal. 3-4x/semana. Sin equipo.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 3,
    weeks: [
      {
        label: 'Semana 1-4 (Calistenia)',
        phase: 'adaptation',
        days: [[
          { name: 'Flexiones', sets: 4, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Dominada', sets: 4, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Sentadilla Aire', sets: 3, reps: '25', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Crunches', sets: 3, reps: '20', rir: 0, rest: 30 },
        ], [
          { name: 'Flexiones Diamante', sets: 3, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Remo Invertido', sets: 3, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Estocadas', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '12', rir: 0, rest: 60 },
          { name: 'Flexiones Declinadas', sets: 3, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Plancha Lateral', sets: 3, reps: '30s', rir: 0, rest: 60 },
        ], [
          { name: 'Flexiones Arco', sets: 4, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Dominada Supina', sets: 4, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Sentadilla Pistola', sets: 3, reps: '6-8', rir: 0, rest: 60 },
          { name: 'Puente de Glúteo', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Fondos Tríceps', sets: 3, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Russian Twist', sets: 3, reps: '20', rir: 0, rest: 30 },
        ]],
      },
    ],
  },

  // ============================================================
  // 21. HIIT / QUEMAGRASA
  // ============================================================
  {
    id: 'hiit',
    name: 'HIIT Metabolico',
    emoji: '🔥',
    desc: 'Alta intensidad 4x/semana. Máxima quema de grasa.',
    level: 'intermediate',
    goal: 'endurance',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Quema)',
        phase: 'endurance',
        days: [[
          { name: 'Burpees', sets: 5, reps: '15', rir: 0, rest: 30 },
          { name: 'Sentadilla Salto', sets: 4, reps: '20', rir: 0, rest: 30 },
          { name: 'Flexiones', sets: 4, reps: '20', rir: 0, rest: 30 },
          { name: 'Mountain Climbers', sets: 4, reps: '30s', rir: 0, rest: 20 },
          { name: 'Kettlebell Swing', sets: 4, reps: '20', rir: 0, rest: 30 },
          { name: 'Plancha', sets: 4, reps: '30s', rir: 0, rest: 20 },
        ], [
          { name: 'Saltos Caja', sets: 4, reps: '12', rir: 0, rest: 30 },
          { name: 'Sentadilla Pistola', sets: 3, reps: '10', rir: 0, rest: 30 },
          { name: 'Fondos Tríceps', sets: 4, reps: '15', rir: 0, rest: 30 },
          { name: 'Escalador', sets: 4, reps: '30s', rir: 0, rest: 20 },
          { name: 'Estocadas Salto', sets: 3, reps: '12', rir: 0, rest: 30 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 30 },
        ], [
          { name: 'Cuerda Saltar', sets: 5, reps: '45s', rir: 0, rest: 15 },
          { name: 'Flexiones Diamante', sets: 4, reps: '15', rir: 0, rest: 30 },
          { name: 'Sentadilla Aire', sets: 4, reps: '25', rir: 0, rest: 30 },
          { name: 'Plancha Laterales', sets: 3, reps: '30s', rir: 0, rest: 20 },
          { name: 'Burpees', sets: 5, reps: '12', rir: 0, rest: 30 },
          { name: 'Bicycle Crunch', sets: 3, reps: '20', rir: 0, rest: 20 },
        ], [
          { name: 'Saltos Caja', sets: 4, reps: '15', rir: 0, rest: 30 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '15', rir: 0, rest: 30 },
          { name: 'Press Mancuernas Plano', sets: 4, reps: '15', rir: 0, rest: 30 },
          { name: 'Mountain Climbers', sets: 4, reps: '30s', rir: 0, rest: 20 },
          { name: 'Kettlebell Swing', sets: 4, reps: '20', rir: 0, rest: 30 },
          { name: 'Russian Twist', sets: 4, reps: '20', rir: 0, rest: 20 },
        ]],
      },
    ],
  },

  // ============================================================
  // 22. MÍNIMO EQUIPO (Bandas + Manc.)
  // ============================================================
  {
    id: 'minimal-equipment',
    name: 'Mínimo Equipo',
    emoji: '🎒',
    desc: 'Rutina con bandas elásticas y mancuernas ligeras. Para viaje.',
    level: 'beginner',
    goal: 'hypertrophy',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Viajero)',
        phase: 'adaptation',
        days: [[
          { name: 'Press Mancuernas Plano', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Remo Mancuerna 1 Mano', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Press Hombro con Mancuernas', sets: 3, reps: '12-15', rir: 1, rest: 60 },
          { name: 'Band Pull Apart', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Curl Martillo', sets: 3, reps: '15', rir: 0, rest: 45 },
          { name: 'Extensión Tríceps Mancuerna', sets: 3, reps: '15', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla Goblet', sets: 3, reps: '15', rir: 1, rest: 60 },
          { name: 'Peso Muerto Manc.', sets: 3, reps: '15', rir: 1, rest: 60 },
          { name: 'Estocadas Manc.', sets: 3, reps: '12', rir: 1, rest: 60 },
          { name: 'Puente de Glúteo', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Band Walks', sets: 3, reps: '15', rir: 0, rest: 45 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 45 },
        ], [
          { name: 'Flexiones', sets: 4, reps: 'al fallo', rir: 0, rest: 60 },
          { name: 'Band Row', sets: 3, reps: '20', rir: 1, rest: 60 },
          { name: 'Band Face Pull', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Curl Band', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Ext. Tríceps Band', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '12', rir: 0, rest: 45 },
        ], [
          { name: 'Sentadilla Manc.', sets: 3, reps: '15', rir: 1, rest: 60 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '12', rir: 1, rest: 60 },
          { name: 'Hip Thrust Manc.', sets: 3, reps: '15', rir: 1, rest: 60 },
          { name: 'Elevación de Talones', sets: 3, reps: '25', rir: 0, rest: 45 },
          { name: 'Band Pull Through', sets: 3, reps: '20', rir: 0, rest: 45 },
          { name: 'Russian Twist', sets: 3, reps: '20', rir: 0, rest: 45 },
        ]],
      },
    ],
  },

  // ============================================================
  // 23. TORSO PIERNA AVANZADO
  // ============================================================
  {
    id: 'torso-pierna-advanced',
    name: 'Torso Pierna Avanzado',
    emoji: '🏋️',
    desc: 'Torso/Pierna 4x. Mayor intensidad y variantes avanzadas.',
    level: 'advanced',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Semana 1-4 (Fuerza)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 5, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Remo con Barra', sets: 5, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Press Hombro con Barra', sets: 4, reps: '5-6', rir: 1, rest: 120 },
          { name: 'Dominada con Lastre', sets: 4, reps: '5-6', rir: 1, rest: 120 },
          { name: 'Fondos con Lastre', sets: 3, reps: '6-8', rir: 0, rest: 90 },
          { name: 'Curl con Barra Z', sets: 3, reps: '8-10', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '8-10', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 4, reps: '3-5', rir: 1, rest: 180 },
          { name: 'Prensa de Piernas', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 4, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Banca Inclinado', sets: 4, reps: '5-6', rir: 1, rest: 150 },
          { name: 'Remo T', sets: 4, reps: '5-6', rir: 1, rest: 150 },
          { name: 'Press Mancuernas Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 3, reps: '12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla Frontal', sets: 4, reps: '5-6', rir: 1, rest: 150 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Hip Thrust', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 24. 5/3/1 BORING BUT BIG (BBB)
  // ============================================================
  {
    id: '531-bbb',
    name: '5/3/1 BBB',
    emoji: '🏅',
    desc: '5/3/1 + 5x10 asistencia. El clásico de Wendler.',
    level: 'advanced',
    goal: 'strength',
    daysPerWeek: 4,
    weeks: [
      {
        label: 'Ciclo 1 (Fuerza + Volumen)',
        phase: 'strength',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Press Banca Plano', sets: 5, reps: '10', rir: 1, rest: 90 },
          { name: 'Remo con Barra', sets: 5, reps: '10', rir: 1, rest: 90 },
          { name: 'Curl con Barra', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Sentadilla con Barra', sets: 5, reps: '10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 5, reps: '10', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Barra', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Press Hombro con Barra', sets: 5, reps: '10', rir: 1, rest: 90 },
          { name: 'Dominada', sets: 5, reps: '10', rir: 1, rest: 90 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ], [
          { name: 'Peso Muerto', sets: 4, reps: '5-5-5+', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 5, reps: '10', rir: 1, rest: 120 },
          { name: 'Sentadilla Búlgara', sets: 4, reps: '10', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 4, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 25. PPL AVANZADO (6 días)
  // ============================================================
  {
    id: 'ppl-advanced',
    name: 'PPL Avanzado',
    emoji: '💪',
    desc: 'PPL 6 días alta intensidad. Para avanzados con experiencia.',
    level: 'advanced',
    goal: 'hypertrophy',
    daysPerWeek: 6,
    weeks: [
      {
        label: 'Semana 1-4 (Intensidad)',
        phase: 'intensity',
        days: [[
          { name: 'Press Banca Plano', sets: 5, reps: '5-8', rir: 1, rest: 150 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '6-8', rir: 1, rest: 90 },
          { name: 'Press Banca Inclinado', sets: 4, reps: '6-8', rir: 1, rest: 90 },
          { name: 'Fondos con Lastre', sets: 3, reps: '8-10', rir: 0, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps con Soga', sets: 3, reps: '10-12', rir: 0, rest: 60 },
        ], [
          { name: 'Dominada con Lastre', sets: 5, reps: '5-8', rir: 1, rest: 150 },
          { name: 'Remo con Barra', sets: 5, reps: '6-8', rir: 1, rest: 120 },
          { name: 'Remo T', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Face Pull', sets: 3, reps: '20', rir: 0, rest: 60 },
          { name: 'Curl con Barra Z', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '5-8', rir: 1, rest: 180 },
          { name: 'Peso Muerto', sets: 4, reps: '5', rir: 1, rest: 180 },
          { name: 'Prensa de Piernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Sentadilla Búlgara', sets: 3, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Curl Femoral', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Press Mancuernas Inclinado', sets: 5, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Banca Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Elevaciones Laterales', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 5, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Dominada', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Remo Mancuerna 1 Mano', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Pajar en Polea', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Concentrado', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Encogimientos con Mancuernas', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 5, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Hip Thrust', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones Sentado', sets: 4, reps: '20', rir: 0, rest: 60 },
          { name: 'Plancha con Lastre', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ]],
      },
    ],
  },

  // ============================================================
  // 26. EMPUJE / TIRO / PIERNAS / HOMBRO / BRAZO
  // ============================================================
  {
    id: 'pplas',
    name: 'PPLAS',
    emoji: '🌟',
    desc: 'Push/Pull/Legs/Arms/Shoulders. 5 días completo.',
    level: 'intermediate',
    goal: 'hypertrophy',
    daysPerWeek: 5,
    weeks: [
      {
        label: 'Semana 1-4 (Hipertrofia)',
        phase: 'hypertrophy',
        days: [[
          { name: 'Press Banca Plano', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Mancuernas Inclinado', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Aperturas en Polea', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Fondos con Lastre', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Cruce de Polea Alta', sets: 3, reps: '15', rir: 0, rest: 60 },
        ], [
          { name: 'Remo con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Dominada con Lastre', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Jalón en Polea Alta', sets: 3, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Remo T', sets: 3, reps: '10-12', rir: 0, rest: 90 },
          { name: 'Face Pull', sets: 3, reps: '15-20', rir: 0, rest: 60 },
        ], [
          { name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Peso Muerto Rumano', sets: 4, reps: '8-10', rir: 1, rest: 120 },
          { name: 'Prensa de Piernas', sets: 3, reps: '12-15', rir: 1, rest: 90 },
          { name: 'Extensión de Cuádriceps', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Curl Femoral', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevación de Talones', sets: 4, reps: '20', rir: 0, rest: 60 },
        ], [
          { name: 'Press Hombro con Barra', sets: 4, reps: '8-10', rir: 1, rest: 90 },
          { name: 'Press Hombro con Mancuernas', sets: 4, reps: '10-12', rir: 1, rest: 90 },
          { name: 'Elevaciones Laterales', sets: 4, reps: '15', rir: 0, rest: 60 },
          { name: 'Elevaciones Frontales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Pajar Laterales', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Plancha', sets: 3, reps: '45s', rir: 0, rest: 60 },
        ], [
          { name: 'Curl con Barra', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Extensión Tríceps en Polea', sets: 4, reps: '10-12', rir: 0, rest: 60 },
          { name: 'Curl Martillo', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Contracción Tríceps', sets: 3, reps: '12-15', rir: 0, rest: 60 },
          { name: 'Curl en Polea Baja', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Fondos en Banco', sets: 3, reps: '15', rir: 0, rest: 60 },
          { name: 'Ab Wheel (Rueda)', sets: 3, reps: '15', rir: 0, rest: 60 },
        ]],
      },
    ],
  },
]
