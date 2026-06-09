export class BaseStep {
  static get type() {
    return "base";
  }

  static get label() {
    return "Base Step";
  }

  static get description() {
    return "Base step contract.";
  }

  static get category() {
    return "Custom";
  }

  static get complexity() {
    return "Easy";
  }

  static get previewMode() {
    return "card";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {};
  }

  static get editorSchema() {
    return {
      fields: []
    };
  }

  static createConfig(config) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      return Object.assign({}, this.defaultConfig);
    }

    return Object.assign({}, this.defaultConfig, config);
  }

  static render(container, config) {
    if (!container) {
      return;
    }

    var safeConfig = this.createConfig(config);
    container.innerHTML = this.renderShell(safeConfig);
  }

  static renderPlayer(container, config, callbacks) {
    if (!container) {
      return;
    }

    var safeConfig = this.createConfig(config);
    container.innerHTML = this.renderPlayerShell(safeConfig);
    this.attachCompletionHandler(container, callbacks);
  }

  static renderShell(config) {
    return '<div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">'
      + this.label
      + '</div>';
  }

  static renderPlayerShell(config) {
    return '<div class="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">'
      + this.label
      + ' player shell'
      + '</div>';
  }

  static attachCompletionHandler(container, callbacks) {
    var buttons = container.querySelectorAll(".oqu-player-complete-btn");
    var buttonIndex = 0;

    while (buttonIndex < buttons.length) {
      buttons[buttonIndex].addEventListener("click", function (event) {
        if (callbacks && typeof callbacks.onComplete === "function") {
          event.preventDefault();
          event.stopPropagation();
          callbacks.onComplete({
            success: true,
            score: 100,
            data: {}
          });
        }
      });

      buttonIndex = buttonIndex + 1;
    }
  }

  static createCompletionGuard(container, callbacks) {
    var hasCompleted = false;

    return {
      complete: function (completionResult) {
        if (hasCompleted) {
          return false;
        }

        if (!container || !callbacks || typeof callbacks.onComplete !== "function") {
          return false;
        }

        hasCompleted = true;
        callbacks.onComplete(createGuardedCompletionResult(completionResult));
        return true;
      }
    };
  }

  static escapeHtml(value) {
    if (typeof value !== "string") {
      return "";
    }

    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  static readText(config, key, fallbackText) {
    if (!config || typeof config[key] !== "string" || config[key].length === 0) {
      return fallbackText;
    }

    return config[key];
  }

  static readNumber(config, key, fallbackNumber) {
    if (config && typeof config[key] === "number" && Number.isFinite(config[key])) {
      return config[key];
    }

    return fallbackNumber;
  }
}

function createGuardedCompletionResult(completionResult) {
  var safeResult = completionResult && typeof completionResult === "object" ? completionResult : {};
  var score = typeof safeResult.score === "number" && Number.isFinite(safeResult.score)
    ? safeResult.score
    : 1;

  return {
    success: safeResult.success === false ? false : true,
    score: score,
    mood: typeof safeResult.mood === "string" ? safeResult.mood : "",
    data: safeResult.data && typeof safeResult.data === "object" && !Array.isArray(safeResult.data)
      ? safeResult.data
      : {}
  };
}

if (typeof window !== "undefined") {
  window.CourseEngine = window.CourseEngine || {};
  window.CourseEngine.BaseStep = BaseStep;
}
