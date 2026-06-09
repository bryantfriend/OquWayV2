const CourseEngineBaseStep = readCourseEngineBaseStep();

export class EmotionalCheckInStep extends CourseEngineBaseStep {
  static get type() {
    return "emotionalCheckIn";
  }

  static get label() {
    return "Emotional Check-In";
  }

  static get description() {
    return "Students choose how they feel and receive a short readiness activity.";
  }

  static get category() {
    return "Basic";
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

  static defaultConfig = {
    title: "Emotional Check-In",
    prompt: "How are you feeling today?",
    moods: [
      "Excited",
      "Calm",
      "Tired",
      "Nervous",
      "Confused",
      "Frustrated"
    ],
    completionButtonText: "Continue"
  };

  static editorSchema = {
    fields: [
      {
        key: "title",
        label: "Step title",
        type: "text"
      },
      {
        key: "prompt",
        label: "Prompt text",
        type: "textarea"
      },
      {
        key: "moods",
        label: "Mood list (one per line)",
        type: "textarea"
      },
      {
        key: "completionButtonText",
        label: "Completion button text",
        type: "text"
      }
    ]
  };

  static createConfig(config) {
    var baseConfig = super.createConfig(config);

    baseConfig.title = this.readText(baseConfig, "title", this.defaultConfig.title);
    baseConfig.prompt = this.readText(baseConfig, "prompt", this.defaultConfig.prompt);
    baseConfig.moods = normalizeMoodList(baseConfig.moods);
    baseConfig.completionButtonText = this.readText(baseConfig, "completionButtonText", this.defaultConfig.completionButtonText);

    return baseConfig;
  }

  static validateConfig(config) {
    var safeConfig = this.createConfig(config);

    return {
      valid: safeConfig.moods.length > 0 && safeConfig.prompt.length > 0,
      errors: safeConfig.moods.length > 0 && safeConfig.prompt.length > 0
        ? []
        : [
          {
            code: "EMOTIONAL_CHECK_IN_CONFIG_INVALID",
            message: "Emotional Check-In requires a prompt and at least one mood."
          }
        ]
    };
  }

  static render(container, config) {
    if (!container) {
      return;
    }

    container.innerHTML = this.renderShell(this.createConfig(config));
  }

  static renderPlayer(container, config, callbacks) {
    var safeConfig = this.createConfig(config);
    var completionGuard = null;
    var moodButtons = null;
    var continueButton = null;
    var selectedMood = "";

    if (!container) {
      return;
    }

    container.innerHTML = this.renderPlayerShell(safeConfig);
    completionGuard = this.createCompletionGuard(container, callbacks);
    moodButtons = container.querySelectorAll("[data-emotional-check-in-mood]");
    continueButton = container.querySelector("[data-emotional-check-in-continue]");

    if (!moodButtons || !continueButton) {
      return;
    }

    moodButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectedMood = button.getAttribute("data-emotional-check-in-mood") || "";
        markSelectedMood(container, selectedMood);
        writeMiniActivity(container, selectedMood);
        continueButton.disabled = false;
      });
    });

    continueButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!selectedMood) {
        return;
      }

      completionGuard.complete({
        success: true,
        mood: selectedMood,
        score: 1,
        data: {
          mood: selectedMood
        }
      });
    });
  }

  static renderShell(config) {
    var safeConfig = this.createConfig(config);

    return '<article class="oqu-player-step oqu-emotional-check-in-step">'
      + '<div class="oqu-emotional-check-in-badge">Reflection</div>'
      + '<h2>' + this.escapeHtml(safeConfig.title) + '</h2>'
      + '<p>' + this.escapeHtml(safeConfig.prompt) + '</p>'
      + '<div class="oqu-emotional-check-in-preview">' + this.escapeHtml(safeConfig.moods.join(" | ")) + '</div>'
      + '</article>';
  }

  static renderPlayerShell(config) {
    var safeConfig = this.createConfig(config);
    var html = "";
    var moodIndex = 0;

    html += '<article class="oqu-player-step oqu-emotional-check-in-step">';
    html += '<div class="oqu-emotional-check-in-badge">Check in</div>';
    html += '<h2>' + this.escapeHtml(safeConfig.title) + '</h2>';
    html += '<p>' + this.escapeHtml(safeConfig.prompt) + '</p>';
    html += '<div class="oqu-emotional-check-in-moods" role="group" aria-label="Choose your mood">';

    while (moodIndex < safeConfig.moods.length) {
      html += '<button type="button" class="oqu-emotional-check-in-mood" data-emotional-check-in-mood="' + this.escapeHtml(safeConfig.moods[moodIndex]) + '">'
        + this.escapeHtml(safeConfig.moods[moodIndex])
        + '</button>';
      moodIndex += 1;
    }

    html += '</div>';
    html += '<div class="oqu-emotional-check-in-activity" data-emotional-check-in-activity hidden></div>';
    html += '<button type="button" class="oqu-player-complete-btn oqu-emotional-check-in-continue" data-emotional-check-in-continue disabled>'
      + this.escapeHtml(safeConfig.completionButtonText)
      + '</button>';
    html += '</article>';

    return html;
  }
}

function readCourseEngineBaseStep() {
  if (typeof window !== "undefined" && window.CourseEngine && window.CourseEngine.BaseStep) {
    return window.CourseEngine.BaseStep;
  }

  return class {
    static get defaultConfig() {
      return {};
    }

    static createConfig(config) {
      return config && typeof config === "object" && !Array.isArray(config) ? Object.assign({}, config) : {};
    }

    static createCompletionGuard() {
      return {
        complete: function () {
          return false;
        }
      };
    }

    static escapeHtml(value) {
      return typeof value === "string" ? value : "";
    }

    static readText(config, key, fallbackText) {
      return config && typeof config[key] === "string" && config[key].length > 0 ? config[key] : fallbackText;
    }
  };
}

function normalizeMoodList(value) {
  var source = Array.isArray(value) ? value : readMoodText(value).split(/\r?\n|,/);
  var moods = [];
  var moodIndex = 0;

  while (moodIndex < source.length) {
    addUniqueMood(moods, source[moodIndex]);
    moodIndex += 1;
  }

  if (moods.length === 0) {
    return EmotionalCheckInStep.defaultConfig.moods.slice();
  }

  return moods;
}

function readMoodText(value) {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

function addUniqueMood(moods, value) {
  var mood = typeof value === "string" ? value.trim() : "";

  if (mood && moods.indexOf(mood) === -1) {
    moods.push(mood);
  }
}

function markSelectedMood(container, selectedMood) {
  var buttons = container ? container.querySelectorAll("[data-emotional-check-in-mood]") : [];
  var buttonIndex = 0;

  while (buttonIndex < buttons.length) {
    if ((buttons[buttonIndex].getAttribute("data-emotional-check-in-mood") || "") === selectedMood) {
      buttons[buttonIndex].classList.add("is-selected");
      buttons[buttonIndex].setAttribute("aria-pressed", "true");
    } else {
      buttons[buttonIndex].classList.remove("is-selected");
      buttons[buttonIndex].setAttribute("aria-pressed", "false");
    }

    buttonIndex += 1;
  }
}

function writeMiniActivity(container, mood) {
  var target = container ? container.querySelector("[data-emotional-check-in-activity]") : null;

  if (!target) {
    return;
  }

  target.textContent = readMoodActivity(mood);
  target.hidden = false;
}

function readMoodActivity(mood) {
  var normalizedMood = typeof mood === "string" ? mood.trim().toLowerCase() : "";

  if (normalizedMood === "excited") {
    return "Set your mission for today.";
  }

  if (normalizedMood === "calm") {
    return "Take one deep breath and get ready.";
  }

  if (normalizedMood === "tired") {
    return "Do a quick stretch or sit up tall.";
  }

  if (normalizedMood === "nervous") {
    return "Try a short breathing activity.";
  }

  if (normalizedMood === "confused") {
    return "Choose one thing you want help with.";
  }

  if (normalizedMood === "frustrated") {
    return "Pause, breathe, and reset.";
  }

  return "Take a moment, then continue when you are ready.";
}
