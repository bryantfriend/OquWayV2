import { EMOTIONAL_CHECK_IN_OPTIONS } from "../domain/emotionalCheckIns/index.js?v=1.1.161-universal-check-in";

export function renderEmotionalCheckInGate(container, checkInContext, callbacks) {
  var state = {
    selectedEmotionKey: "",
    isSaving: false,
    error: callbacks && callbacks.initialError ? callbacks.initialError : "",
    thanks: false
  };
  var safeCallbacks = callbacks && typeof callbacks === "object" ? callbacks : {};

  if (!container) {
    return {
      destroy: function () {}
    };
  }

  function render() {
    container.innerHTML = buildCheckInHtml(checkInContext, state);
  }

  function handleClick(event) {
    var emotionButton = event.target.closest(".oqu-check-in-emotion");
    var continueButton = event.target.closest(".oqu-check-in-continue");
    var retryButton = event.target.closest(".oqu-check-in-retry");
    var skipButton = event.target.closest(".oqu-check-in-skip");

    if (emotionButton && !state.isSaving) {
      state.selectedEmotionKey = emotionButton.getAttribute("data-emotion-key") || "";
      state.error = "";
      render();
      return;
    }

    if (continueButton && state.selectedEmotionKey && !state.isSaving) {
      saveSelection();
      return;
    }

    if (retryButton && !state.isSaving) {
      state.error = "";
      render();
      if (typeof safeCallbacks.onRetry === "function") {
        safeCallbacks.onRetry();
      }
      return;
    }

    if (skipButton && !state.isSaving && typeof safeCallbacks.onContinueWithoutCheckIn === "function") {
      cleanup();
      safeCallbacks.onContinueWithoutCheckIn();
    }
  }

  async function saveSelection() {
    if (typeof safeCallbacks.onSave !== "function") {
      return;
    }

    state.isSaving = true;
    state.error = "";
    render();

    try {
      await safeCallbacks.onSave(state.selectedEmotionKey);
      state.isSaving = false;
      state.thanks = true;
      render();

      window.setTimeout(function () {
        cleanup();
        if (typeof safeCallbacks.onContinue === "function") {
          safeCallbacks.onContinue();
        }
      }, 700);
    } catch (error) {
      state.isSaving = false;
      state.error = "We could not save your check-in. You can try again or continue without checking in.";
      render();
    }
  }

  function cleanup() {
    container.removeEventListener("click", handleClick);
  }

  container.addEventListener("click", handleClick);
  render();

  return {
    destroy: cleanup
  };
}

function buildCheckInHtml(checkInContext, state) {
  var title = readText(checkInContext && checkInContext.programName) || "your learning";
  var html = "";

  html += '<section class="oqu-check-in-shell" aria-live="polite">';
  html += '<div class="oqu-check-in-card">';

  if (state.thanks) {
    html += '<div class="oqu-check-in-thanks"><div class="oqu-check-in-thanks-icon">✓</div><h1>Thanks for checking in.</h1><p>You are ready to continue.</p></div>';
    html += '</div></section>';
    return html;
  }

  html += '<div class="oqu-check-in-header">';
  html += '<p class="oqu-check-in-eyebrow">OquWay Check-In</p>';
  html += '<h1>How are you feeling right now?</h1>';
  html += '<p>Before you start ' + escapeHtml(title) + ', choose the feeling that is closest for you.</p>';
  html += '</div>';
  html += '<div class="oqu-check-in-grid" role="list">';
  EMOTIONAL_CHECK_IN_OPTIONS.forEach(function (option) {
    var isSelected = state.selectedEmotionKey === option.key;
    html += '<button type="button" class="oqu-check-in-emotion' + (isSelected ? " is-selected" : "") + '" data-emotion-key="' + escapeHtml(option.key) + '" role="listitem" aria-pressed="' + (isSelected ? "true" : "false") + '">';
    html += '<span class="oqu-check-in-emoji">' + escapeHtml(option.emoji) + '</span>';
    html += '<span>' + escapeHtml(option.label) + '</span>';
    html += '</button>';
  });
  html += '</div>';

  if (state.error) {
    html += '<div class="oqu-check-in-error">' + escapeHtml(state.error) + '</div>';
  }

  html += '<div class="oqu-check-in-actions">';
  if (state.error) {
    html += '<button type="button" class="oqu-check-in-retry">Try Again</button>';
    html += '<button type="button" class="oqu-check-in-skip">Continue Without Check-In</button>';
  } else {
    html += '<button type="button" class="oqu-check-in-skip">Continue Without Check-In</button>';
    html += '<button type="button" class="oqu-check-in-continue" ' + (!state.selectedEmotionKey || state.isSaving ? "disabled" : "") + '>' + (state.isSaving ? "Saving..." : "Continue") + '</button>';
  }
  html += '</div>';
  html += '</div></section>';
  return html;
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

function escapeHtml(value) {
  return readText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
