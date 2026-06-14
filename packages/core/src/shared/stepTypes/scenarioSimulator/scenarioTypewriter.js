export function startTypewriter(text, targetElement, options) {
  var safeText = String(text || "");
  var safeOptions = options && typeof options === "object" ? options : {};
  var speed = Math.max(8, Number(safeOptions.speed) || 22);
  var index = 0;
  var timerId = null;

  if (!targetElement) {
    return function () {};
  }

  targetElement.textContent = "";

  timerId = window.setInterval(function () {
    if (!targetElement.isConnected) {
      cleanup();
      return;
    }

    targetElement.textContent = safeText.slice(0, index + 1);
    index = index + 1;

    if (index >= safeText.length) {
      cleanup();
      if (typeof safeOptions.onComplete === "function") {
        safeOptions.onComplete();
      }
    }
  }, speed);

  function cleanup() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  return cleanup;
}
