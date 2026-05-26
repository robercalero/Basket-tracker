export const todayKey = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().split('T')[0];
};
export const getTodayIdx = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1 };
export const fmtDate = s => {
  if (typeof s === 'string') {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return s.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
};
export const fmtSecs = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
