import { EMOTIONAL_CHECK_IN_CATEGORIES, getEmotionalCheckInOption } from "../domain/emotionalCheckIns/index.js?v=1.1.162-modal-stack";

export function renderEmotionalCheckInGate(container, checkInContext, callbacks) {
  var state = {
    selectedEmotionKey: "",
    isConfirming: false,
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
    var confirmButton = event.target.closest(".oqu-check-in-confirm");
    var chooseDifferentButton = event.target.closest(".oqu-check-in-change");
    var retryButton = event.target.closest(".oqu-check-in-retry");
    var skipButton = event.target.closest(".oqu-check-in-skip");

    if (emotionButton && !state.isSaving) {
      state.selectedEmotionKey = emotionButton.getAttribute("data-emotion-key") || "";
      state.isConfirming = true;
      state.error = "";
      render();
      return;
    }

    if (chooseDifferentButton && !state.isSaving) {
      state.isConfirming = false;
      state.error = "";
      render();
      return;
    }

    if (confirmButton && state.selectedEmotionKey && !state.isSaving) {
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
      state.error = "Couldn't save right now. You can still continue.";
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
    html += '<div class="oqu-check-in-thanks"><div class="oqu-check-in-thanks-icon">✓</div><h1>Thanks for checking in.</h1><p>You can continue learning now.</p></div>';
    html += '</div></section>';
    return html;
  }

  html += '<div class="oqu-check-in-header">';
  html += '<p class="oqu-check-in-eyebrow">OquWay Check-In</p>';
  html += '<h1>How are you feeling right now?</h1>';
  html += '<p>Before you start ' + escapeHtml(title) + ', choose the feeling that is closest for you. Your teacher uses this to better support the class.</p>';
  html += '</div>';

  if (state.isConfirming) {
    html += buildConfirmationHtml(state);
  } else {
    html += buildGroupedMoodHtml(state);
  }

  if (state.error) {
    html += '<div class="oqu-check-in-error">' + escapeHtml(state.error) + '</div>';
  }

  html += '</div></section>';
  return html;
}

function buildGroupedMoodHtml(state) {
  var html = "";

  html += '<div class="oqu-check-in-groups" role="list">';
  EMOTIONAL_CHECK_IN_CATEGORIES.forEach(function (category) {
    html += '<section class="oqu-check-in-group" aria-label="' + escapeHtml(category.label) + '">';
    html += '<h2>' + escapeHtml(category.label) + '</h2>';
    html += '<div class="oqu-check-in-options">';
    category.options.forEach(function (option) {
      var isSelected = state.selectedEmotionKey === option.key;
      html += '<button type="button" class="oqu-check-in-emotion' + (isSelected ? " is-selected" : "") + '" data-emotion-key="' + escapeHtml(option.key) + '" role="listitem" aria-pressed="' + (isSelected ? "true" : "false") + '">';
      html += '<span class="oqu-check-in-emoji">' + escapeHtml(option.emoji) + '</span>';
      html += '<span>' + escapeHtml(option.label) + '</span>';
      html += '</button>';
    });
    html += '</div>';
    html += '</section>';
  });
  html += '</div>';
  html += '<div class="oqu-check-in-actions">';
  html += '<button type="button" class="oqu-check-in-skip">Continue Without Check-In</button>';
  html += '</div>';

  return html;
}

function buildConfirmationHtml(state) {
  var selected = getEmotionalCheckInOption(state.selectedEmotionKey);
  var html = "";

  if (!selected) {
    return buildGroupedMoodHtml(state);
  }

  html += '<div class="oqu-check-in-confirmation">';
  html += '<p>You selected:</p>';
  html += '<strong><span>' + escapeHtml(selected.emoji) + '</span> ' + escapeHtml(selected.label) + '</strong>';
  html += '</div>';
  html += '<div class="oqu-check-in-actions">';
  if (state.error) {
    html += '<button type="button" class="oqu-check-in-retry">Try Again</button>';
  }
  html += '<button type="button" class="oqu-check-in-change">Choose Different Feeling</button>';
  html += '<button type="button" class="oqu-check-in-skip">Continue Without Check-In</button>';
  html += '<button type="button" class="oqu-check-in-confirm" ' + (state.isSaving ? "disabled" : "") + '>' + (state.isSaving ? "Saving..." : "Confirm Check-In") + '</button>';
  html += '</div>';

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
