let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, type = "sine", gainPeak = 0.16) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playCorrect() {
  tone(523.25, 0, 0.12);
  tone(659.25, 0.09, 0.16);
  tone(783.99, 0.18, 0.22);
}

export function playWrong() {
  tone(196, 0, 0.22, "sawtooth", 0.07);
  tone(146.83, 0.07, 0.28, "sawtooth", 0.07);
}

export function playStreak() {
  tone(659.25, 0, 0.09);
  tone(783.99, 0.07, 0.09);
  tone(987.77, 0.14, 0.1);
  tone(1174.66, 0.21, 0.18);
}

export function playFinish() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22));
}
