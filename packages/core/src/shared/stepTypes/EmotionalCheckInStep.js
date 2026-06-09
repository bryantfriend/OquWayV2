const BaseStep = window.CourseEngine.BaseStep;

export default class EmotionalCheckInStep extends BaseStep {
  static get id() {
    return "emotional-check-in";
  }

  static get version() {
    return "1.0.0";
  }

  static get displayName() {
    return "Emotional Check-In";
  }

  static get type() {
    return this.id;
  }

  static get label() {
    return this.displayName;
  }

  static get description() {
    return "Students choose their current status and complete a short reset activity before learning.";
  }

  static get category() {
    return "reflection";
  }

  static get complexity() {
    return "Easy";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "manual";
  }

  static get icon() {
    return "💙";
  }

  static get tags() {
    return ["emotion", "mood", "check-in", "reflection", "starter", "wellbeing"];
  }

  static validateConfig(config) {
    var safeConfig = this.createConfig(config);
    var moods = parseMoodsText(safeConfig.moodsText);

    return {
      valid: moods.length > 0,
      errors: moods.length > 0 ? [] : [
        {
          code: "EMOTIONAL_CHECK_IN_CONFIG_INVALID",
          message: "Emotional Check-In requires at least one mood/status option."
        }
      ]
    };
  }

  static defaultConfig = {
    title: "System Check-In",
    subtitle: "Select your current status to initialize today's session.",
    completionButtonText: "Initialize Lesson 🚀",
    successTitle: "Diagnostics Complete",
    successSubtitle: "Your system is optimized and ready for learning.",
    successButtonText: "Enter Workspace",
    moodsText: "sad|😔|Low Energy|system-recalibration\ntired|🥱|Needs Recharging|kinetic-generator\nfrustrated|😤|Overloaded|malware-purge\nhyper|🤪|Overclocked|sequence-lock\nanxious|😰|Processing...|disk-defragmentation\nhappy|😎|System Ready|secret-handshake",
    breathingCycles: 3,
    batteryTarget: 100,
    bugCount: 6,
    sequenceCount: 5,
    defragBlockCount: 15,
    showSuccessView: "true",
    theme: "system"
  };

  static editorSchema = {
    fields: [
      {
        key: "title",
        label: "Step title",
        type: "text"
      },
      {
        key: "subtitle",
        label: "Subtitle / prompt",
        type: "textarea"
      },
      {
        key: "completionButtonText",
        label: "Completion button text",
        type: "text"
      },
      {
        key: "successTitle",
        label: "Success title",
        type: "text"
      },
      {
        key: "successSubtitle",
        label: "Success subtitle",
        type: "textarea"
      },
      {
        key: "successButtonText",
        label: "Success button text",
        type: "text"
      },
      {
        key: "moodsText",
        label: "Mood/status list",
        type: "textarea"
      },
      {
        key: "breathingCycles",
        label: "Breathing cycles",
        type: "number"
      },
      {
        key: "batteryTarget",
        label: "Battery target",
        type: "number"
      },
      {
        key: "bugCount",
        label: "Bug count",
        type: "number"
      },
      {
        key: "sequenceCount",
        label: "Sequence count",
        type: "number"
      },
      {
        key: "defragBlockCount",
        label: "Defrag block count",
        type: "number"
      },
      {
        key: "showSuccessView",
        label: "Show success view",
        type: "select",
        options: [
          {
            value: "true",
            label: "Yes"
          },
          {
            value: "false",
            label: "No"
          }
        ]
      },
      {
        key: "theme",
        label: "Theme",
        type: "select",
        options: [
          {
            value: "system",
            label: "System"
          }
        ]
      }
    ]
  };

  static createConfig(config) {
    var sourceConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
    var baseConfig = Object.assign({}, this.defaultConfig, sourceConfig);

    baseConfig.title = readText(baseConfig.title, this.defaultConfig.title);
    baseConfig.subtitle = readText(baseConfig.subtitle || baseConfig.prompt, this.defaultConfig.subtitle);
    baseConfig.completionButtonText = readText(baseConfig.completionButtonText, this.defaultConfig.completionButtonText);
    baseConfig.successTitle = readText(baseConfig.successTitle, this.defaultConfig.successTitle);
    baseConfig.successSubtitle = readText(baseConfig.successSubtitle, this.defaultConfig.successSubtitle);
    baseConfig.successButtonText = readText(baseConfig.successButtonText, this.defaultConfig.successButtonText);
    baseConfig.moodsText = normalizeMoodsText(baseConfig.moodsText || baseConfig.moods);
    baseConfig.breathingCycles = clampInteger(baseConfig.breathingCycles, 1, 5, this.defaultConfig.breathingCycles);
    baseConfig.batteryTarget = clampInteger(baseConfig.batteryTarget, 25, 100, this.defaultConfig.batteryTarget);
    baseConfig.bugCount = clampInteger(baseConfig.bugCount, 5, 6, this.defaultConfig.bugCount);
    baseConfig.sequenceCount = clampInteger(baseConfig.sequenceCount, 3, 5, this.defaultConfig.sequenceCount);
    baseConfig.defragBlockCount = clampInteger(baseConfig.defragBlockCount, 3, 25, this.defaultConfig.defragBlockCount);
    baseConfig.showSuccessView = baseConfig.showSuccessView === "false" ? "false" : "true";
    baseConfig.theme = baseConfig.theme === "system" ? "system" : this.defaultConfig.theme;

    return baseConfig;
  }

  static render(container, config) {
    this.assertRenderArgs({ container: container });
    renderEmotionalCheckIn(container, this.createConfig(config), function () {});
  }

  static renderPlayer(container, config, callbacks) {
    var onComplete = callbacks && typeof callbacks.onComplete === "function" ? callbacks.onComplete : null;
    var complete = this.createCompletionGuard(onComplete);

    this.assertRenderArgs({ container: container });
    renderEmotionalCheckIn(container, this.createConfig(config), function (completionData) {
      complete.complete(completionData);
    });
  }
}

function renderEmotionalCheckIn(container, config, onComplete) {
  var state = {
    config: config,
    moods: parseMoodsText(config.moodsText),
    selectedMood: null,
    activityCompleted: false,
    completed: false,
    cleanup: []
  };

  container.innerHTML = buildStepHtml(config, state.moods);
  bindTeardownObserver(container, state);
  bindMoodSelection(container, state, onComplete);
}

function buildStepHtml(config, moods) {
  var html = "";
  var moodIndex = 0;

  html += '<section class="eci-root eci-theme-system" data-eci-root>';
  html += buildScopedStyles();
  html += '<div class="eci-shell">';
  html += '<div class="eci-header">';
  html += '<span class="eci-kicker">Reflection Protocol</span>';
  html += '<h2>' + escapeHtml(config.title) + '</h2>';
  html += '<p>' + escapeHtml(config.subtitle) + '</p>';
  html += '</div>';
  html += '<div class="eci-panel" data-eci-panel="moods">';
  html += '<div class="eci-grid" role="group" aria-label="Select your current status">';

  while (moodIndex < moods.length) {
    html += '<button type="button" class="eci-mood-card" data-eci-mood-key="' + escapeHtml(moods[moodIndex].key) + '">';
    html += '<span class="eci-mood-emoji" aria-hidden="true">' + escapeHtml(moods[moodIndex].emoji) + '</span>';
    html += '<span class="eci-mood-label">' + escapeHtml(moods[moodIndex].label) + '</span>';
    html += '<span class="eci-mood-action">Start check</span>';
    html += '</button>';
    moodIndex += 1;
  }

  html += '</div>';
  html += '</div>';
  html += '<div class="eci-panel" data-eci-panel="activity" hidden></div>';
  html += '<div class="eci-panel" data-eci-panel="success" hidden></div>';
  html += '</div>';
  html += '</section>';

  return html;
}

function bindMoodSelection(container, state, onComplete) {
  var buttons = container ? container.querySelectorAll("[data-eci-mood-key]") : [];
  var index = 0;

  while (index < buttons.length) {
    buttons[index].addEventListener("click", function (event) {
      var button = event.currentTarget;
      var mood = findMoodByKey(state.moods, button ? button.getAttribute("data-eci-mood-key") : "");

      event.preventDefault();
      if (mood) {
        showActivity(container, state, mood, onComplete);
      }
    });
    index += 1;
  }
}

function showActivity(container, state, mood, onComplete) {
  var moodPanel = container ? container.querySelector('[data-eci-panel="moods"]') : null;
  var activityPanel = container ? container.querySelector('[data-eci-panel="activity"]') : null;

  cleanupState(state);
  state.selectedMood = mood;
  state.activityCompleted = false;

  if (!moodPanel || !activityPanel) {
    return;
  }

  moodPanel.hidden = true;
  activityPanel.hidden = false;
  activityPanel.innerHTML = buildActivityShell(state.config, mood);
  bindActivityShell(container, state, onComplete);
  startActivity(container, state);
}

function buildActivityShell(config, mood) {
  var activity = readActivityDefinition(mood.activityKey);
  var html = "";

  html += '<div class="eci-activity-card" data-eci-activity="' + escapeHtml(activity.key) + '">';
  html += '<div class="eci-activity-top">';
  html += '<div>';
  html += '<span class="eci-kicker">' + escapeHtml(mood.emoji + " " + mood.label) + '</span>';
  html += '<h3>' + escapeHtml(activity.title) + '</h3>';
  html += '<p>' + escapeHtml(activity.description) + '</p>';
  html += '</div>';
  html += '<button type="button" class="eci-back-btn" data-eci-back>Back</button>';
  html += '</div>';
  html += '<div class="eci-activity-area" data-eci-activity-area></div>';
  html += '<div class="eci-progress" data-eci-progress>' + escapeHtml(activity.startProgress) + '</div>';
  html += '<div class="eci-status" data-eci-status aria-live="polite"></div>';
  html += '<button type="button" class="eci-final-btn" data-eci-final disabled>' + escapeHtml(config.completionButtonText) + '</button>';
  html += '</div>';

  return html;
}

function bindActivityShell(container, state, onComplete) {
  var backButton = container ? container.querySelector("[data-eci-back]") : null;
  var finalButton = container ? container.querySelector("[data-eci-final]") : null;

  if (backButton) {
    backButton.addEventListener("click", function (event) {
      event.preventDefault();
      showMoodSelection(container, state);
    });
  }

  if (finalButton) {
    finalButton.addEventListener("click", function (event) {
      event.preventDefault();
      if (!state.activityCompleted) {
        return;
      }
      showSuccess(container, state, onComplete);
    });
  }
}

function showMoodSelection(container, state) {
  var moodPanel = container ? container.querySelector('[data-eci-panel="moods"]') : null;
  var activityPanel = container ? container.querySelector('[data-eci-panel="activity"]') : null;
  var successPanel = container ? container.querySelector('[data-eci-panel="success"]') : null;

  cleanupState(state);
  state.selectedMood = null;
  state.activityCompleted = false;

  if (moodPanel) moodPanel.hidden = false;
  if (activityPanel) {
    activityPanel.hidden = true;
    activityPanel.innerHTML = "";
  }
  if (successPanel) {
    successPanel.hidden = true;
    successPanel.innerHTML = "";
  }
}

function showSuccess(container, state, onComplete) {
  var activityPanel = container ? container.querySelector('[data-eci-panel="activity"]') : null;
  var successPanel = container ? container.querySelector('[data-eci-panel="success"]') : null;
  var config = state.config;

  cleanupState(state);

  if (!successPanel || !state.selectedMood) {
    return;
  }

  if (activityPanel) activityPanel.hidden = true;
  successPanel.hidden = false;
  successPanel.innerHTML = '<div class="eci-success-card">'
    + '<div class="eci-success-orb">✓</div>'
    + '<h3>' + escapeHtml(config.successTitle) + '</h3>'
    + '<p>' + escapeHtml(config.successSubtitle) + '</p>'
    + '<button type="button" class="eci-success-btn" data-eci-complete>' + escapeHtml(config.successButtonText) + '</button>'
    + '</div>';

  bindSuccess(container, state, onComplete);
}

function bindSuccess(container, state, onComplete) {
  var completeButton = container ? container.querySelector("[data-eci-complete]") : null;

  if (!completeButton) {
    return;
  }

  completeButton.addEventListener("click", function (event) {
    var mood = state.selectedMood;
    var completedAt = new Date().toISOString();

    event.preventDefault();
    if (state.completed || !mood || typeof onComplete !== "function") {
      return;
    }

    state.completed = true;
    onComplete({
      success: true,
      score: 1,
      mood: mood.label,
      moodKey: mood.key,
      moodLabel: mood.label,
      activityKey: mood.activityKey,
      activityCompleted: true,
      completedAt: completedAt,
      data: {
        moodKey: mood.key,
        moodLabel: mood.label,
        activityKey: mood.activityKey,
        activityCompleted: true,
        completedAt: completedAt
      }
    });
  });
}

function bindTeardownObserver(container, state) {
  var root = container ? container.querySelector("[data-eci-root]") : null;
  var observer = null;

  if (!root || typeof MutationObserver === "undefined" || typeof document === "undefined" || !document.body) {
    return;
  }

  observer = new MutationObserver(function () {
    if (root.isConnected) {
      return;
    }

    cleanupState(state);
    observer.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  state.cleanup.push(function () {
    observer.disconnect();
  });
}

function startActivity(container, state) {
  var mood = state.selectedMood;

  if (!mood) {
    return;
  }

  if (mood.activityKey === "kinetic-generator") {
    startBatteryActivity(container, state);
    return;
  }

  if (mood.activityKey === "malware-purge") {
    startMalwareActivity(container, state);
    return;
  }

  if (mood.activityKey === "sequence-lock") {
    startSequenceActivity(container, state);
    return;
  }

  if (mood.activityKey === "disk-defragmentation") {
    startDefragActivity(container, state);
    return;
  }

  if (mood.activityKey === "secret-handshake") {
    startHandshakeActivity(container, state);
    return;
  }

  startBreathingActivity(container, state);
}

function startBreathingActivity(container, state) {
  var area = queryActivityArea(container);
  var target = state.config.breathingCycles;
  var cycles = 0;
  var progress = queryProgress(container);
  var phaseIndex = 0;
  var phases = [
    {
      label: "Breathe in",
      className: "is-breathe-in",
      duration: 4000
    },
    {
      label: "Hold",
      className: "is-breathe-hold",
      duration: 2000
    },
    {
      label: "Breathe out",
      className: "is-breathe-out",
      duration: 5000
    }
  ];

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-breathing">'
    + '<div class="eci-breathing-orb" data-eci-orb></div>'
    + '<div class="eci-breathing-text" data-eci-breathing-text>Breathe in</div>'
    + '<div class="eci-breathing-note">Slow and steady. No rush.</div>'
    + '</div>';
  updateProgress(progress, "Cycle 1 / " + target);
  runBreathingPhase();

  function runBreathingPhase() {
    var orb = area.querySelector("[data-eci-orb]");
    var text = area.querySelector("[data-eci-breathing-text]");
    var phase = phases[phaseIndex];

    if (!orb || !text || state.activityCompleted) {
      return;
    }

    orb.classList.remove("is-breathe-in", "is-breathe-hold", "is-breathe-out");
    orb.classList.add(phase.className);
    text.textContent = phase.label;

    scheduleTimeout(state, function () {
      phaseIndex += 1;

      if (phaseIndex >= phases.length) {
        cycles += 1;
        phaseIndex = 0;

        if (cycles >= target) {
          unlockActivity(container, state, "Nice and steady. Your system is calm.");
          return;
        }

        updateProgress(progress, "Cycle " + (cycles + 1) + " / " + target);
      }

      runBreathingPhase();
    }, phase.duration);
  }
}

function startBatteryActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var target = state.config.batteryTarget;
  var charge = 0;
  var holdInterval = null;

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-battery-wrap">'
    + '<div class="eci-battery"><div class="eci-battery-fill" data-eci-battery-fill></div></div>'
    + '<button type="button" class="eci-generate-btn" data-eci-generate>⚡ GENERATE ⚡</button>'
    + '</div>';

  updateProgress(progress, "Battery: 0%");

  function addCharge(amount) {
    var fill = area.querySelector("[data-eci-battery-fill]");
    charge = Math.min(target, charge + amount);
    if (fill) {
      fill.style.width = charge + "%";
      fill.style.background = charge < 50 ? "#f59e0b" : charge < 80 ? "#22c55e" : "#14f195";
    }
    updateProgress(progress, "Battery: " + charge + "%");
    if (charge >= target) {
      stopHold();
      unlockActivity(container, state, "System Fully Charged!");
    }
  }

  function startHold() {
    stopHold();
    addCharge(5);
    holdInterval = setInterval(function () {
      addCharge(4);
    }, 120);
  }

  function stopHold() {
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  var button = area.querySelector("[data-eci-generate]");
  if (button) {
    button.addEventListener("click", function () {
      addCharge(10);
    });
    button.addEventListener("pointerdown", startHold);
    button.addEventListener("pointerup", stopHold);
    button.addEventListener("pointercancel", stopHold);
    button.addEventListener("mouseleave", stopHold);
  }

  state.cleanup.push(stopHold);
}

function startMalwareActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var thoughts = createNoiseThoughts(state.config.bugCount);
  var sorted = 0;
  var thoughtIndex = 0;

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-noise-field" data-eci-noise-field>'
    + '<div class="eci-noise-bubbles" data-eci-noise-bubbles></div>'
    + '<div class="eci-noise-zones" data-eci-noise-zones>'
    + '<button type="button" class="eci-noise-zone" data-eci-noise-zone="do-now">Do Now</button>'
    + '<button type="button" class="eci-noise-zone" data-eci-noise-zone="do-later">Do Later</button>'
    + '<button type="button" class="eci-noise-zone" data-eci-noise-zone="let-go">Let Go</button>'
    + '</div>'
    + '</div>';
  updateProgress(progress, "Thoughts sorted: 0 / " + thoughts.length);

  var field = area.querySelector("[data-eci-noise-field]");
  var bubbleArea = area.querySelector("[data-eci-noise-bubbles]");
  if (!field || !bubbleArea) {
    return;
  }

  while (thoughtIndex < thoughts.length) {
    bubbleArea.appendChild(createNoiseBubble(thoughts[thoughtIndex], thoughtIndex));
    thoughtIndex += 1;
  }

  field.addEventListener("click", function (event) {
    var zone = event.target.closest("[data-eci-noise-zone]");
    var bubble = event.target.closest("[data-eci-noise-bubble]");

    if (zone) {
      event.preventDefault();
      sortBubble(field.querySelector(".is-selected"), zone.getAttribute("data-eci-noise-zone"));
      return;
    }

    if (bubble) {
      event.preventDefault();
      selectBubble(field, bubble);
    }
  });

  field.addEventListener("keydown", function (event) {
    var bubble = event.target.closest("[data-eci-noise-bubble]");
    if (bubble && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      selectBubble(field, bubble);
    }
  });

  field.addEventListener("dragstart", function (event) {
    var bubble = event.target.closest("[data-eci-noise-bubble]");
    if (bubble && event.dataTransfer) {
      event.dataTransfer.setData("text/plain", bubble.getAttribute("data-eci-noise-bubble"));
      selectBubble(field, bubble);
    }
  });

  field.addEventListener("dragover", function (event) {
    if (event.target.closest("[data-eci-noise-zone]")) {
      event.preventDefault();
    }
  });

  field.addEventListener("drop", function (event) {
    var zone = event.target.closest("[data-eci-noise-zone]");
    var id = event.dataTransfer ? event.dataTransfer.getData("text/plain") : "";
    var bubble = id ? field.querySelector('[data-eci-noise-bubble="' + id + '"]') : field.querySelector(".is-selected");

    if (zone) {
      event.preventDefault();
      sortBubble(bubble, zone.getAttribute("data-eci-noise-zone"));
    }
  });

  function sortBubble(bubble, zoneKey) {
    var zone = field.querySelector('[data-eci-noise-zone="' + zoneKey + '"]');

    if (!bubble || !zone || bubble.disabled) {
      return;
    }
    bubble.disabled = true;
    bubble.draggable = false;
    bubble.classList.remove("is-selected");
    bubble.classList.add("is-sorted");
    zone.appendChild(bubble);
    sorted += 1;
    updateProgress(progress, "Thoughts sorted: " + sorted + " / " + thoughts.length);

    if (sorted >= thoughts.length) {
      unlockActivity(container, state, "Nice. Your brain has less noise now.");
    }
  }
}

function startSequenceActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var count = state.config.sequenceCount;
  var next = 1;
  var resetTimeout = null;
  var nodeIndex = 1;
  var symbols = ["◆", "●", "▲", "★", "✦"];

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-sequence-field" data-eci-sequence-field>'
    + '<p class="eci-sequence-purpose">Focus on one pattern at a time.</p>'
    + '<div class="eci-sequence-preview" data-eci-sequence-preview></div>'
    + '<div class="eci-sequence-board" data-eci-sequence-board></div>'
    + '</div>';
  updateProgress(progress, "Pattern: 1 / " + count);

  var field = area.querySelector("[data-eci-sequence-field]");
  var board = area.querySelector("[data-eci-sequence-board]");
  var preview = area.querySelector("[data-eci-sequence-preview]");
  if (!field || !board || !preview) {
    return;
  }

  while (nodeIndex <= count) {
    preview.appendChild(createSequencePreviewNode(symbols[nodeIndex - 1], nodeIndex));
    board.appendChild(createSequenceNode(nodeIndex, symbols[nodeIndex - 1]));
    nodeIndex += 1;
  }

  field.addEventListener("click", function (event) {
    var node = event.target.closest("[data-eci-sequence-node]");
    if (node) {
      event.preventDefault();
      chooseNode(node);
    }
  });

  field.addEventListener("keydown", function (event) {
    var node = event.target.closest("[data-eci-sequence-node]");
    if (node && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      chooseNode(node);
    }
  });

  function chooseNode(node) {
    var value = Number(node.getAttribute("data-eci-sequence-node"));
    if (value !== next) {
      field.classList.add("is-shaking");
      updateStatus(container, "Try that pattern again, slowly.");
      resetTimeout = scheduleTimeout(state, function () {
        resetSequence(field);
        next = 1;
        field.classList.remove("is-shaking");
        updateStatus(container, "");
        updateProgress(progress, "Pattern: 1 / " + count);
      }, 800);
      return;
    }

    node.classList.add("is-complete");
    node.disabled = true;
    markSequencePreview(preview, next);
    next += 1;

    if (next > count) {
      field.classList.add("is-unlocked");
      unlockActivity(container, state, "Focus Locked!");
      return;
    }

    updateProgress(progress, "Pattern: " + next + " / " + count);
  }

  state.cleanup.push(function () {
    clearTimeout(resetTimeout);
  });
}

function startDefragActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var count = state.config.defragBlockCount;
  var sorted = 0;
  var index = 0;

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-defrag-field" data-eci-defrag-field>'
    + '<div class="eci-rack" data-eci-rack aria-label="Organized rack"></div>'
    + '</div>';
  updateProgress(progress, "Blocks Sorted: 0 / " + count);

  var field = area.querySelector("[data-eci-defrag-field]");
  var rack = area.querySelector("[data-eci-rack]");
  if (!field || !rack) {
    return;
  }

  while (index < count) {
    field.appendChild(createDefragBlock(index));
    index += 1;
  }

  field.addEventListener("click", function (event) {
    var block = event.target.closest("[data-eci-block]");
    if (block) {
      event.preventDefault();
      sortBlock(block);
    }
  });

  field.addEventListener("keydown", function (event) {
    var block = event.target.closest("[data-eci-block]");
    if (block && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      sortBlock(block);
    }
  });

  function sortBlock(block) {
    if (!block || block.disabled) {
      return;
    }
    block.disabled = true;
    block.classList.add("is-sorted");
    rack.appendChild(block);
    sorted += 1;
    updateProgress(progress, "Blocks Sorted: " + sorted + " / " + count);
    if (sorted >= count) {
      field.classList.add("is-complete");
      unlockActivity(container, state, "System Organized!");
    }
  }
}

function startHandshakeActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var step = 0;
  var sequence = [
    {
      emoji: "👋",
      label: "high five"
    },
    {
      emoji: "✊",
      label: "fist bump"
    },
    {
      emoji: "👍",
      label: "thumbs up"
    },
    {
      emoji: "👏",
      label: "clap"
    },
    {
      emoji: "🤝",
      label: "handshake"
    }
  ];

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-handshake" data-eci-handshake>'
    + '<div class="eci-handshake-progress" data-eci-handshake-progress></div>'
    + '<div class="eci-handshake-target" data-eci-handshake-target aria-label="Secret handshake target"><span data-eci-handshake-target-emoji>✨</span></div>'
    + '<div class="eci-handshake-options" data-eci-handshake-options></div>'
    + '<div class="eci-handshake-instruction" data-eci-handshake-instruction>Choose ' + escapeHtml(sequence[0].label) + '.</div>'
    + '</div>';
  updateProgress(progress, "Handshake: 1 / " + sequence.length);

  var pad = area.querySelector("[data-eci-handshake]");
  var target = area.querySelector("[data-eci-handshake-target]");
  var options = area.querySelector("[data-eci-handshake-options]");
  var progressRow = area.querySelector("[data-eci-handshake-progress]");
  if (!pad || !target || !options || !progressRow) {
    return;
  }

  renderHandshakeProgress(progressRow, sequence, step);
  renderHandshakeOptions(options, sequence);

  options.addEventListener("click", function (event) {
    var option = event.target.closest("[data-eci-handshake-option]");
    if (option) {
      event.preventDefault();
      chooseHandshake(option.getAttribute("data-eci-handshake-option"));
    }
  });

  options.addEventListener("dragstart", function (event) {
    var option = event.target.closest("[data-eci-handshake-option]");
    if (option && event.dataTransfer) {
      event.dataTransfer.setData("text/plain", option.getAttribute("data-eci-handshake-option"));
    }
  });

  target.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  target.addEventListener("drop", function (event) {
    var key = event.dataTransfer ? event.dataTransfer.getData("text/plain") : "";
    event.preventDefault();
    chooseHandshake(key);
  });

  function chooseHandshake(label) {
    var expected = sequence[step];
    var instruction = area.querySelector("[data-eci-handshake-instruction]");
    var targetEmoji = area.querySelector("[data-eci-handshake-target-emoji]");

    if (!expected || state.activityCompleted) {
      return;
    }

    if (label !== expected.label) {
      target.classList.add("is-shaking");
      updateStatus(container, "That move is not next. Try " + expected.label + ".");
      scheduleTimeout(state, function () {
        target.classList.remove("is-shaking");
      }, 360);
      return;
    }

    if (targetEmoji) {
      targetEmoji.textContent = expected.emoji;
      target.classList.add("is-pulsing");
      scheduleTimeout(state, function () {
        target.classList.remove("is-pulsing");
      }, 220);
    }

    updateStatus(container, "");
    step += 1;
    renderHandshakeProgress(progressRow, sequence, step);

    if (step >= sequence.length) {
      updateProgress(progress, "Handshake: " + sequence.length + " / " + sequence.length);
      unlockActivity(container, state, "Access Granted!");
      return;
    }

    if (instruction) {
      instruction.textContent = "Choose " + sequence[step].label + ".";
    }
    updateProgress(progress, "Handshake: " + (step + 1) + " / " + sequence.length);
  }
}

function unlockActivity(container, state, message) {
  var finalButton = container ? container.querySelector("[data-eci-final]") : null;

  state.activityCompleted = true;
  updateStatus(container, message);
  if (finalButton) {
    finalButton.disabled = false;
    finalButton.focus();
  }
}

function cleanupState(state) {
  var cleanup = state.cleanup || [];
  var index = 0;

  while (index < cleanup.length) {
    if (typeof cleanup[index] === "function") {
      cleanup[index]();
    }
    index += 1;
  }

  state.cleanup = [];
}

function queryActivityArea(container) {
  return container ? container.querySelector("[data-eci-activity-area]") : null;
}

function queryProgress(container) {
  return container ? container.querySelector("[data-eci-progress]") : null;
}

function updateProgress(progress, text) {
  if (progress) {
    progress.textContent = text;
  }
}

function updateStatus(container, text) {
  var status = container ? container.querySelector("[data-eci-status]") : null;
  if (status) {
    status.textContent = text;
  }
}

function scheduleTimeout(state, callback, delay) {
  var timeoutId = null;
  var cleanup = function () {
    clearTimeout(timeoutId);
  };

  timeoutId = setTimeout(function () {
    removeCleanup(state, cleanup);
    callback();
  }, delay);

  state.cleanup.push(cleanup);
  return timeoutId;
}

function removeCleanup(state, cleanup) {
  var index = state && Array.isArray(state.cleanup) ? state.cleanup.indexOf(cleanup) : -1;

  if (index !== -1) {
    state.cleanup.splice(index, 1);
  }
}

function createNoiseThoughts(count) {
  var labels = [
    "Homework",
    "Noise",
    "Question",
    "Worry",
    "Later idea",
    "Take a break"
  ];
  var thoughts = [];
  var index = 0;
  var safeCount = clampInteger(count, 5, 6, 6);

  while (index < safeCount) {
    thoughts.push(labels[index]);
    index += 1;
  }

  return thoughts;
}

function createNoiseBubble(label, index) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "eci-noise-bubble";
  button.draggable = true;
  button.setAttribute("data-eci-noise-bubble", String(index));
  button.setAttribute("aria-label", "Sort thought " + label);
  button.textContent = label;
  return button;
}

function selectBubble(field, bubble) {
  var selected = field ? field.querySelectorAll(".eci-noise-bubble.is-selected") : [];
  var index = 0;

  while (index < selected.length) {
    selected[index].classList.remove("is-selected");
    index += 1;
  }

  if (bubble && !bubble.disabled) {
    bubble.classList.add("is-selected");
  }
}

function createBugButton(index) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "eci-bug";
  button.setAttribute("data-eci-bug", String(index));
  button.setAttribute("aria-label", "Destroy malware " + (index + 1));
  button.textContent = "👾";
  placeAbsolute(button, 8 + ((index * 17) % 82), 8 + ((index * 23) % 62));
  return button;
}

function moveBugs(field) {
  var bugs = field ? field.querySelectorAll("[data-eci-bug]") : [];
  var index = 0;

  while (index < bugs.length) {
    if (!bugs[index].disabled) {
      placeAbsolute(bugs[index], 6 + Math.random() * 86, 7 + Math.random() * 64);
    }
    index += 1;
  }
}

function drawLaser(field, target, state) {
  var laser = document.createElement("span");
  var rect = target.getBoundingClientRect();
  var fieldRect = field.getBoundingClientRect();
  laser.className = "eci-laser";
  laser.style.left = ((rect.left - fieldRect.left) + rect.width / 2) + "px";
  laser.style.top = ((rect.top - fieldRect.top) + rect.height / 2) + "px";
  field.appendChild(laser);
  scheduleTimeout(state, function () {
    if (laser.parentNode) {
      laser.parentNode.removeChild(laser);
    }
  }, 220);
}

function createSequencePreviewNode(symbol, number) {
  var span = document.createElement("span");
  span.className = "eci-sequence-preview-node";
  span.setAttribute("data-eci-sequence-preview-node", String(number));
  span.textContent = symbol;
  return span;
}

function markSequencePreview(preview, number) {
  var node = preview ? preview.querySelector('[data-eci-sequence-preview-node="' + number + '"]') : null;
  if (node) {
    node.classList.add("is-complete");
  }
}

function createSequenceNode(number, symbol) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "eci-sequence-node";
  button.setAttribute("data-eci-sequence-node", String(number));
  button.setAttribute("aria-label", "Sequence node " + number);
  button.textContent = symbol || String(number);
  return button;
}

function resetSequence(field) {
  var nodes = field ? field.querySelectorAll("[data-eci-sequence-node]") : [];
  var previewNodes = field ? field.querySelectorAll("[data-eci-sequence-preview-node]") : [];
  var index = 0;

  while (index < nodes.length) {
    nodes[index].disabled = false;
    nodes[index].classList.remove("is-complete");
    index += 1;
  }

  index = 0;
  while (index < previewNodes.length) {
    previewNodes[index].classList.remove("is-complete");
    index += 1;
  }
}

function renderHandshakeOptions(container, sequence) {
  var index = 0;
  var html = "";

  while (index < sequence.length) {
    html += '<button type="button" class="eci-handshake-option" draggable="true" data-eci-handshake-option="' + escapeHtml(sequence[index].label) + '">'
      + '<span>' + escapeHtml(sequence[index].emoji) + '</span>'
      + '<small>' + escapeHtml(sequence[index].label) + '</small>'
      + '</button>';
    index += 1;
  }

  container.innerHTML = html;
}

function renderHandshakeProgress(container, sequence, completedCount) {
  var index = 0;
  var html = "";

  while (index < sequence.length) {
    html += '<span class="' + (index < completedCount ? "is-complete" : "") + '">' + escapeHtml(sequence[index].emoji) + '</span>';
    index += 1;
  }

  container.innerHTML = html;
}

function createDefragBlock(index) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "eci-block";
  button.setAttribute("data-eci-block", String(index));
  button.setAttribute("aria-label", "Sort data block " + (index + 1));
  button.textContent = "";
  placeAbsolute(button, 5 + ((index * 13) % 85), 9 + ((index * 31) % 60));
  return button;
}

function placeAbsolute(element, left, top) {
  element.style.left = left + "%";
  element.style.top = top + "%";
}

function findMoodByKey(moods, key) {
  var index = 0;
  while (index < moods.length) {
    if (moods[index].key === key) {
      return moods[index];
    }
    index += 1;
  }
  return null;
}

function parseMoodsText(value) {
  var text = normalizeMoodsText(value);
  var lines = text.split(/\r?\n/);
  var moods = [];
  var seen = {};
  var lineIndex = 0;

  while (lineIndex < lines.length) {
    var parts = lines[lineIndex].split("|");
    var key = parts.length > 0 ? parts[0].trim() : "";
    var emoji = parts.length > 1 ? parts[1].trim() : "";
    var label = parts.length > 2 ? parts[2].trim() : "";
    var activityKey = normalizeActivityKey(parts.length > 3 ? parts[3].trim() : "");

    if (key && !seen[key]) {
      moods.push({
        key: key,
        emoji: emoji || "💙",
        label: label || key,
        activityKey: activityKey
      });
      seen[key] = true;
    }

    lineIndex += 1;
  }

  if (moods.length === 0 && text !== EmotionalCheckInStep.defaultConfig.moodsText) {
    return parseMoodsText(EmotionalCheckInStep.defaultConfig.moodsText);
  }

  return moods;
}

function normalizeMoodsText(value) {
  if (typeof value === "string") {
    if (value.trim().length === 0) {
      return EmotionalCheckInStep.defaultConfig.moodsText;
    }

    if (value.indexOf("|") === -1 && value.indexOf(",") !== -1) {
      return createMoodTextFromLabels(value.split(","));
    }

    return value;
  }

  if (Array.isArray(value)) {
    return createMoodTextFromLabels(value);
  }

  return EmotionalCheckInStep.defaultConfig.moodsText;
}

function createMoodTextFromLabels(labels) {
  var lines = [];
  var index = 0;

  while (index < labels.length) {
    var label = typeof labels[index] === "string" ? labels[index].trim() : "";
    if (label) {
      lines.push(createMoodLineFromLabel(label));
    }
    index += 1;
  }

  return lines.length > 0 ? lines.join("\n") : EmotionalCheckInStep.defaultConfig.moodsText;
}

function createMoodLineFromLabel(label) {
  var key = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mood";
  return key + "|💙|" + label + "|system-recalibration";
}

function normalizeActivityKey(activityKey) {
  if (activityKey === "kinetic-generator" ||
    activityKey === "malware-purge" ||
    activityKey === "sequence-lock" ||
    activityKey === "disk-defragmentation" ||
    activityKey === "secret-handshake" ||
    activityKey === "system-recalibration") {
    return activityKey;
  }

  return "system-recalibration";
}

function readActivityDefinition(activityKey) {
  var key = normalizeActivityKey(activityKey);
  var definitions = {
    "system-recalibration": {
      key: "system-recalibration",
      title: "Calm Breathing",
      description: "Complete three slow breathing cycles to settle your body before learning.",
      startProgress: "Cycle 1 / 3"
    },
    "kinetic-generator": {
      key: "kinetic-generator",
      title: "Kinetic Generator",
      description: "Generate energy until the system battery reaches full charge.",
      startProgress: "Battery: 0%"
    },
    "malware-purge": {
      key: "malware-purge",
      title: "Sort the Noise",
      description: "Move each thought into Do Now, Do Later, or Let Go.",
      startProgress: "Thoughts sorted: 0 / 6"
    },
    "sequence-lock": {
      key: "sequence-lock",
      title: "Sequence Lock",
      description: "Focus on one pattern at a time and unlock the sequence.",
      startProgress: "Next Target: 1"
    },
    "disk-defragmentation": {
      key: "disk-defragmentation",
      title: "Disk Defragmentation",
      description: "Sort scattered data blocks into the organized rack.",
      startProgress: "Blocks Sorted: 0 / 15"
    },
    "secret-handshake": {
      key: "secret-handshake",
      title: "Secret Handshake",
      description: "Tap or drag each gesture into the center to complete the handshake.",
      startProgress: "Handshake Step: 1 / 5"
    }
  };

  return definitions[key] || definitions["system-recalibration"];
}

function readText(value, fallbackText) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackText;
}

function clampInteger(value, minimum, maximum, fallbackValue) {
  var numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    numberValue = fallbackValue;
  }
  numberValue = Math.round(numberValue);
  if (numberValue < minimum) return minimum;
  if (numberValue > maximum) return maximum;
  return numberValue;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildScopedStyles() {
  return '<style>'
    + '.eci-root{width:100%;box-sizing:border-box;color:#eef7ff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.eci-root *{box-sizing:border-box}.eci-shell{width:min(900px,100%);margin:0 auto;border:1px solid rgba(125,211,252,.28);border-radius:20px;padding:16px;background:radial-gradient(circle at 18% 12%,rgba(45,212,191,.2),transparent 28%),linear-gradient(145deg,#09111f,#121a2f 55%,#08111f);box-shadow:0 18px 48px rgba(2,6,23,.28);overflow:hidden}.eci-header{text-align:center;margin-bottom:12px}.eci-kicker{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(103,232,249,.22);border-radius:999px;padding:5px 9px;background:rgba(8,47,73,.52);color:#67e8f9;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.eci-header h2,.eci-activity-top h3,.eci-success-card h3{margin:8px 0 4px;font-size:clamp(24px,3.2vw,38px);line-height:1.02;font-weight:900;letter-spacing:0}.eci-header p,.eci-activity-top p,.eci-success-card p{margin:0;color:#b7c7da;line-height:1.4}.eci-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.eci-mood-card{min-height:108px;border:1px solid rgba(148,163,184,.24);border-radius:18px;background:linear-gradient(180deg,rgba(15,23,42,.84),rgba(30,41,59,.72));color:#fff;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.eci-mood-card:hover,.eci-mood-card:focus-visible{transform:translateY(-2px);border-color:#22d3ee;box-shadow:0 14px 28px rgba(34,211,238,.14);outline:none}.eci-mood-emoji{font-size:30px}.eci-mood-label{font-size:14px;font-weight:900}.eci-mood-action{font-size:10px;color:#93c5fd;text-transform:uppercase;font-weight:800;letter-spacing:.06em}.eci-activity-card{border:1px solid rgba(148,163,184,.22);border-radius:20px;padding:14px;background:rgba(15,23,42,.62)}.eci-activity-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.eci-activity-top h3{font-size:25px}.eci-back-btn,.eci-final-btn,.eci-success-btn,.eci-generate-btn{border:0;border-radius:12px;padding:10px 13px;font-weight:900;cursor:pointer}.eci-back-btn{background:rgba(148,163,184,.14);color:#cbd5e1;border:1px solid rgba(148,163,184,.24)}.eci-final-btn,.eci-success-btn{width:100%;margin-top:10px;background:linear-gradient(135deg,#10b981,#22c55e);color:#052e16;box-shadow:0 12px 22px rgba(34,197,94,.2)}.eci-final-btn:disabled{cursor:not-allowed;opacity:.42;box-shadow:none}.eci-activity-area{position:relative;min-height:235px;margin-top:10px;border-radius:18px;border:1px solid rgba(59,130,246,.18);background:linear-gradient(145deg,rgba(15,23,42,.78),rgba(8,47,73,.42));overflow:hidden}.eci-progress{margin-top:8px;color:#a7f3d0;font-weight:900}.eci-status{min-height:20px;margin-top:4px;color:#fef08a;font-weight:900}.eci-breathing{min-height:235px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}.eci-breathing-orb{width:112px;height:112px;border-radius:999px;background:radial-gradient(circle,#e0f2fe,#22d3ee 46%,#0f766e 78%);box-shadow:0 0 34px rgba(34,211,238,.54);transform:scale(.72);transition:transform 4s ease-in-out}.eci-breathing-orb.is-breathe-in{transform:scale(1.12)}.eci-breathing-orb.is-breathe-hold{transform:scale(1.12);transition-duration:2s}.eci-breathing-orb.is-breathe-out{transform:scale(.72);transition-duration:5s}.eci-breathing-text{font-size:24px;font-weight:900;color:#f8fafc}.eci-breathing-note{color:#bfdbfe;font-size:13px;font-weight:800}.eci-battery-wrap{min-height:235px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}.eci-battery{position:relative;width:min(320px,78%);height:72px;border:3px solid #dbeafe;border-radius:16px;padding:7px;background:rgba(15,23,42,.88)}.eci-battery:after{content:"";position:absolute;right:-17px;top:20px;width:12px;height:26px;border-radius:0 8px 8px 0;background:#dbeafe}.eci-battery-fill{height:100%;width:0;border-radius:10px;background:#f59e0b;transition:width .12s linear,background .2s ease}.eci-noise-field{min-height:235px;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:12px;padding:12px}.eci-noise-bubbles{display:flex;align-content:center;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px}.eci-noise-bubble{border:1px solid rgba(147,197,253,.35);border-radius:999px;background:rgba(219,234,254,.95);color:#0f172a;padding:10px 14px;font-weight:900;cursor:grab;box-shadow:0 10px 20px rgba(15,23,42,.12)}.eci-noise-bubble.is-selected{outline:3px solid #67e8f9}.eci-noise-bubble.is-sorted{margin:4px;padding:7px 10px;font-size:12px;cursor:default}.eci-noise-zones{display:grid;gap:8px}.eci-noise-zone{border:1px dashed rgba(167,243,208,.42);border-radius:16px;background:rgba(6,78,59,.28);color:#d1fae5;min-height:62px;padding:8px;font-weight:900;text-align:center}.eci-sequence-field{min-height:235px;display:grid;grid-template-rows:auto auto 1fr;gap:10px;padding:12px}.eci-sequence-purpose{text-align:center;color:#bfdbfe;font-weight:900;margin:0}.eci-sequence-preview,.eci-sequence-board{display:flex;align-items:center;justify-content:center;gap:10px}.eci-sequence-preview-node{width:34px;height:34px;border-radius:999px;background:rgba(148,163,184,.2);display:grid;place-items:center;color:#dbeafe;font-weight:900}.eci-sequence-preview-node.is-complete{background:#22c55e;color:#052e16;box-shadow:0 0 18px rgba(34,197,94,.4)}.eci-sequence-board{min-height:110px}.eci-sequence-node{position:static;transform:none;width:58px;height:58px;border:0;border-radius:20px;background:#eff6ff;color:#0f172a;font-size:22px;font-weight:900;cursor:pointer;box-shadow:0 10px 20px rgba(15,23,42,.18);transition:transform .16s ease,box-shadow .16s ease,background .16s ease}.eci-sequence-node.is-complete{background:#22c55e;color:#052e16;transform:scale(1.08);box-shadow:0 0 24px rgba(34,197,94,.42)}.eci-sequence-field.is-shaking{animation:eci-shake .32s ease}.eci-sequence-field.is-unlocked .eci-sequence-board{animation:eci-unlock .55s ease}.eci-defrag-field{position:relative;width:100%;height:235px}.eci-rack{position:absolute;left:16px;right:16px;bottom:12px;min-height:54px;border:1px dashed rgba(196,181,253,.48);border-radius:16px;background:rgba(88,28,135,.18);display:flex;align-items:center;gap:6px;padding:8px;z-index:2}.eci-block{position:absolute;transform:translate(-50%,-50%);width:32px;height:32px;border:0;border-radius:10px;background:linear-gradient(135deg,#c084fc,#7c3aed);box-shadow:0 10px 22px rgba(124,58,237,.24);cursor:pointer}.eci-block.is-sorted{position:static;transform:none;opacity:.9;transition:opacity .2s ease}.eci-defrag-field.is-complete .eci-block{animation:eci-fade .5s ease forwards}.eci-handshake{min-height:235px;display:grid;grid-template-rows:auto 1fr auto auto;align-items:center;justify-items:center;gap:9px;padding:10px;touch-action:none}.eci-handshake-progress{display:flex;gap:6px}.eci-handshake-progress span{width:30px;height:30px;border-radius:999px;background:rgba(148,163,184,.2);display:grid;place-items:center;filter:grayscale(.75);opacity:.65}.eci-handshake-progress span.is-complete{background:rgba(34,197,94,.22);filter:none;opacity:1}.eci-handshake-target{width:108px;height:108px;border-radius:34px;border:2px dashed rgba(125,211,252,.55);display:grid;place-items:center;background:rgba(8,47,73,.38);font-size:48px;transition:transform .18s ease,box-shadow .18s ease}.eci-handshake-target.is-pulsing{transform:scale(1.1);box-shadow:0 0 28px rgba(45,212,191,.4)}.eci-handshake-target.is-shaking{animation:eci-shake .32s ease}.eci-handshake-options{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.eci-handshake-option{border:1px solid rgba(147,197,253,.32);border-radius:16px;background:rgba(15,23,42,.72);color:#fff;padding:8px 10px;display:grid;gap:3px;place-items:center;cursor:grab;min-width:74px}.eci-handshake-option span{font-size:28px}.eci-handshake-option small{font-size:10px;font-weight:900;text-transform:uppercase;color:#bfdbfe}.eci-handshake-instruction{font-size:15px;font-weight:900;color:#dbeafe;text-align:center}.eci-success-card{text-align:center;border-radius:20px;padding:24px;background:linear-gradient(145deg,rgba(20,184,166,.18),rgba(37,99,235,.14));border:1px solid rgba(125,211,252,.28)}.eci-success-orb{width:76px;height:76px;margin:0 auto 10px;border-radius:999px;display:grid;place-items:center;background:#22c55e;color:#052e16;font-size:38px;font-weight:900;box-shadow:0 0 34px rgba(34,197,94,.36)}@keyframes eci-pop{to{opacity:0;transform:scale(3)}}@keyframes eci-fade{to{opacity:0;transform:scale(.8)}}@keyframes eci-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}@keyframes eci-unlock{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}@media (max-height:760px){.eci-shell{padding:12px}.eci-header{margin-bottom:8px}.eci-header h2{font-size:28px}.eci-activity-area{min-height:210px}.eci-breathing,.eci-noise-field,.eci-sequence-field,.eci-handshake{min-height:210px}.eci-activity-top h3{font-size:22px}.eci-final-btn{margin-top:8px}}@media (max-width:720px){.eci-shell{padding:12px;border-radius:18px}.eci-grid{grid-template-columns:1fr}.eci-activity-top{flex-direction:column}.eci-back-btn{width:100%}.eci-noise-field{grid-template-columns:1fr}.eci-header h2{font-size:30px}}'
    + '</style>';
}

export { EmotionalCheckInStep };
