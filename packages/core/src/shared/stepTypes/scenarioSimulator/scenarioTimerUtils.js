export function readTimerSecondsForDifficulty(difficulty, timerSeconds) {
  if (difficulty === "easy") {
    return 8;
  }

  if (difficulty === "hard") {
    return 3;
  }

  if (difficulty === "custom") {
    return readPositiveNumber(timerSeconds, 5);
  }

  return 5;
}

export function createManagedTimer(options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var durationMs = Math.max(500, readPositiveNumber(safeOptions.durationSeconds, 5) * 1000);
  var intervalMs = Math.max(50, readPositiveNumber(safeOptions.intervalMs, 100));
  var startedAt = Date.now();
  var timerId = null;
  var ended = false;

  function tick() {
    var elapsedMs = Date.now() - startedAt;
    var remainingMs = Math.max(0, durationMs - elapsedMs);
    var progress = remainingMs / durationMs;

    if (typeof safeOptions.onTick === "function") {
      safeOptions.onTick({
        remainingMs: remainingMs,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        progress: progress
      });
    }

    if (remainingMs <= 0 && !ended) {
      ended = true;
      cleanup();
      if (typeof safeOptions.onExpire === "function") {
        safeOptions.onExpire();
      }
    }
  }

  function cleanup() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  timerId = window.setInterval(tick, intervalMs);
  tick();

  return cleanup;
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : fallbackValue;
}
