export const todayKey = () => new Date().toISOString().split('T')[0];
export const getTodayIdx = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 };
export const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtSecs = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
