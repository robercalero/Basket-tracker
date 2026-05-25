export const $ = id => document.getElementById(id);
export const mk = (t, c) => { const e = document.createElement(t); if (c) e.className = c; return e };
export const div = c => mk('div', c);
export const el = (t, c, x) => { const e = mk(t, c); if (x !== undefined) e.textContent = x; return e };
