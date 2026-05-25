let _actx = null;

function getACtx() {
  if (!_actx || _actx.state === 'closed') _actx = new (window.AudioContext || window.webkitAudioContext)();
  return _actx;
}

export function beep(freq = 880, dur = .15, vol = .35) {
  try {
    const ctx = getACtx();
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + dur);
    o.start(); o.stop(ctx.currentTime + dur);
  } catch { }
}

export const bDone = () => { beep(660, .1); setTimeout(() => beep(880, .2), 120) };
export const bPR = () => { beep(523, .08); setTimeout(() => beep(659, .08), 90); setTimeout(() => beep(784, .2), 180) };
export const bTick = () => beep(440, .07, .2);
