// Optional Web Audio beeps — enable by setting SOUND_ENABLED = true
const SOUND_ENABLED = false;

let audioCtx = null;

function getContext() {
  if (!SOUND_ENABLED) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function beep(frequency, duration, type = 'sine') {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  beep(523, 0.12);
  setTimeout(() => beep(659, 0.15), 80);
}

export function playWrong() {
  beep(220, 0.2, 'square');
}

export function playTap() {
  beep(440, 0.06);
}

export function playCelebrate() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => beep(f, 0.18), i * 120);
  });
}
