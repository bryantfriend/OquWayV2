export function initSequenceAudio() {
  var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  var context = null;

  if (!AudioContextConstructor) {
    return null;
  }

  try {
    context = new AudioContextConstructor();
    if (context && context.state === "suspended" && typeof context.resume === "function") {
      context.resume();
    }
    return context;
  } catch (error) {
    return null;
  }
}

export function playPadTone(audioContext, frequency, options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var duration = Math.max(0.05, Number(safeOptions.durationSeconds) || 0.18);
  var safeFrequency = Number(frequency);
  var oscillator = null;
  var gain = null;

  if (!audioContext || !Number.isFinite(safeFrequency) || safeFrequency <= 0) {
    return;
  }

  try {
    oscillator = audioContext.createOscillator();
    gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = safeFrequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (error) {
    // Visual playback remains usable if a browser rejects audio playback.
  }
}

export function cleanupSequenceAudio(audioContext) {
  if (!audioContext || typeof audioContext.close !== "function") {
    return;
  }

  try {
    if (audioContext.state !== "closed") {
      audioContext.close();
    }
  } catch (error) {
    // Audio cleanup is best-effort across browsers.
  }
}
