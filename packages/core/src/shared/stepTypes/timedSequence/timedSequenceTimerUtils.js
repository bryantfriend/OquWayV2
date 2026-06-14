export function createTimedSequenceTimer(options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var durationSeconds = Math.max(1, Number(safeOptions.durationSeconds) || 1);
  var intervalMs = Math.max(100, Number(safeOptions.intervalMs) || 100);
  var startedAt = Date.now();
  var timerId = null;
  var expired = false;

  function tick() {
    var elapsedMs = Date.now() - startedAt;
    var remainingMs = Math.max(0, durationSeconds * 1000 - elapsedMs);
    var remainingSeconds = Math.ceil(remainingMs / 1000);
    var progress = durationSeconds > 0 ? remainingMs / (durationSeconds * 1000) : 0;

    if (typeof safeOptions.onTick === "function") {
      safeOptions.onTick({
        remainingSeconds: remainingSeconds,
        progress: Math.max(0, Math.min(1, progress))
      });
    }

    if (remainingMs <= 0 && !expired) {
      expired = true;
      cleanup();
      if (typeof safeOptions.onExpire === "function") {
        safeOptions.onExpire();
      }
    }
  }

  timerId = window.setInterval(tick, intervalMs);
  tick();

  function cleanup() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  return cleanup;
}
