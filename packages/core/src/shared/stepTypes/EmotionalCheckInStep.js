const BaseStep = window.CourseEngine.BaseStep;

export class EmotionalCheckInStep extends BaseStep {
  static get type() {
    return "emotional-check-in";
  }

  static get label() {
    return "Emotional Check-In";
  }

  static get description() {
    return "Students choose a session-scoped status and complete a short readiness activity.";
  }

  static get category() {
    return "Reflection";
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
    bugCount: 15,
    sequenceCount: 12,
    defragBlockCount: 15,
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
    baseConfig.bugCount = clampInteger(baseConfig.bugCount, 3, 25, this.defaultConfig.bugCount);
    baseConfig.sequenceCount = clampInteger(baseConfig.sequenceCount, 3, 15, this.defaultConfig.sequenceCount);
    baseConfig.defragBlockCount = clampInteger(baseConfig.defragBlockCount, 3, 25, this.defaultConfig.defragBlockCount);
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
  var breatheIn = true;
  var intervalId = null;
  var progress = queryProgress(container);

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-breathing">'
    + '<div class="eci-breathing-orb" data-eci-orb></div>'
    + '<div class="eci-breathing-text" data-eci-breathing-text>Breathe In</div>'
    + '</div>';
  updateProgress(progress, "Cycles: 0 / " + target);

  intervalId = setInterval(function () {
    var orb = area.querySelector("[data-eci-orb]");
    var text = area.querySelector("[data-eci-breathing-text]");

    if (!orb || !text) {
      return;
    }

    if (breatheIn) {
      orb.classList.add("is-breathe-out");
      text.textContent = "Breathe Out";
      breatheIn = false;
      return;
    }

    cycles += 1;
    updateProgress(progress, "Cycles: " + cycles + " / " + target);
    orb.classList.remove("is-breathe-out");
    text.textContent = "Breathe In";
    breatheIn = true;

    if (cycles >= target) {
      clearInterval(intervalId);
      unlockActivity(container, state, "System Stabilized!");
    }
  }, 900);

  state.cleanup.push(function () {
    clearInterval(intervalId);
  });
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
  var count = state.config.bugCount;
  var destroyed = 0;
  var intervalId = null;
  var bugIndex = 0;

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-malware-field" data-eci-malware-field>'
    + '<div class="eci-ship" aria-hidden="true">🚀</div>'
    + '</div>';
  updateProgress(progress, "Malware Destroyed: 0 / " + count);

  var field = area.querySelector("[data-eci-malware-field]");
  if (!field) {
    return;
  }

  while (bugIndex < count) {
    field.appendChild(createBugButton(bugIndex));
    bugIndex += 1;
  }

  field.addEventListener("click", function (event) {
    var bug = event.target.closest("[data-eci-bug]");
    if (bug) {
      event.preventDefault();
      destroyBug(field, bug);
    }
  });

  field.addEventListener("keydown", function (event) {
    var bug = event.target.closest("[data-eci-bug]");
    if (bug && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      destroyBug(field, bug);
    }
  });

  function destroyBug(fieldEl, bugEl) {
    if (!bugEl || bugEl.disabled) {
      return;
    }
    bugEl.disabled = true;
    bugEl.classList.add("is-destroyed");
    drawLaser(fieldEl, bugEl);
    destroyed += 1;
    updateProgress(progress, "Malware Destroyed: " + destroyed + " / " + count);
    setTimeout(function () {
      if (bugEl && bugEl.parentNode) {
        bugEl.parentNode.removeChild(bugEl);
      }
    }, 220);
    if (destroyed >= count) {
      clearInterval(intervalId);
      unlockActivity(container, state, "System Purged!");
    }
  }

  intervalId = setInterval(function () {
    moveBugs(field);
  }, 700);

  state.cleanup.push(function () {
    clearInterval(intervalId);
  });
}

function startSequenceActivity(container, state) {
  var area = queryActivityArea(container);
  var progress = queryProgress(container);
  var count = state.config.sequenceCount;
  var next = 1;
  var resetTimeout = null;
  var nodeIndex = 1;

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-sequence-field" data-eci-sequence-field></div>';
  updateProgress(progress, "Next Target: 1");

  var field = area.querySelector("[data-eci-sequence-field]");
  if (!field) {
    return;
  }

  while (nodeIndex <= count) {
    field.appendChild(createSequenceNode(nodeIndex));
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
      updateStatus(container, "Wrong order! Resetting...");
      resetTimeout = setTimeout(function () {
        resetSequence(field);
        next = 1;
        updateStatus(container, "");
        updateProgress(progress, "Next Target: 1");
      }, 800);
      return;
    }

    node.classList.add("is-complete");
    node.disabled = true;
    next += 1;

    if (next > count) {
      unlockActivity(container, state, "Focus Locked!");
      return;
    }

    updateProgress(progress, "Next Target: " + next);
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
  var dragStart = null;
  var instructions = [
    "Click or tap high five.",
    "Drag the fist up to bump.",
    "Drag the fist down to bump.",
    "Drag right to smash.",
    "Drag left and away to explode."
  ];

  if (!area) {
    return;
  }

  area.innerHTML = '<div class="eci-handshake" tabindex="0" data-eci-handshake>'
    + '<div class="eci-handshake-hand" data-eci-hand>✋</div>'
    + '<div class="eci-handshake-instruction" data-eci-handshake-instruction>' + escapeHtml(instructions[0]) + '</div>'
    + '</div>';
  updateProgress(progress, "Handshake Step: 1 / 5");

  var pad = area.querySelector("[data-eci-handshake]");
  if (!pad) {
    return;
  }

  pad.addEventListener("click", function () {
    if (step === 0) {
      advanceHandshake();
    }
  });

  pad.addEventListener("pointerdown", function (event) {
    dragStart = {
      x: event.clientX,
      y: event.clientY
    };
  });

  pad.addEventListener("pointerup", function (event) {
    if (!dragStart) {
      return;
    }
    handleHandshakeDelta(event.clientX - dragStart.x, event.clientY - dragStart.y);
    dragStart = null;
  });

  pad.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (step === 0) {
        advanceHandshake();
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      handleHandshakeDelta(0, -60);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      handleHandshakeDelta(0, 60);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleHandshakeDelta(60, 0);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleHandshakeDelta(-60, 0);
    }
  });

  function handleHandshakeDelta(deltaX, deltaY) {
    if (step === 1 && deltaY < -30) {
      advanceHandshake();
    } else if (step === 2 && deltaY > 30) {
      advanceHandshake();
    } else if (step === 3 && deltaX > 30) {
      advanceHandshake();
    } else if (step === 4 && deltaX < -30) {
      advanceHandshake();
    }
  }

  function advanceHandshake() {
    var hand = area.querySelector("[data-eci-hand]");
    var instruction = area.querySelector("[data-eci-handshake-instruction]");

    step += 1;
    if (hand) {
      hand.textContent = step >= 5 ? "💥" : "👊";
      hand.classList.add("is-pulsing");
      setTimeout(function () {
        if (hand) hand.classList.remove("is-pulsing");
      }, 220);
    }

    if (step >= 5) {
      updateProgress(progress, "Handshake Step: 5 / 5");
      unlockActivity(container, state, "Access Granted!");
      return;
    }

    if (instruction) {
      instruction.textContent = instructions[step];
    }
    updateProgress(progress, "Handshake Step: " + (step + 1) + " / 5");
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

function drawLaser(field, target) {
  var laser = document.createElement("span");
  var rect = target.getBoundingClientRect();
  var fieldRect = field.getBoundingClientRect();
  laser.className = "eci-laser";
  laser.style.left = ((rect.left - fieldRect.left) + rect.width / 2) + "px";
  laser.style.top = ((rect.top - fieldRect.top) + rect.height / 2) + "px";
  field.appendChild(laser);
  setTimeout(function () {
    if (laser.parentNode) {
      laser.parentNode.removeChild(laser);
    }
  }, 220);
}

function createSequenceNode(number) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "eci-sequence-node";
  button.setAttribute("data-eci-sequence-node", String(number));
  button.setAttribute("aria-label", "Sequence node " + number);
  button.textContent = String(number);
  placeAbsolute(button, 7 + ((number * 29) % 82), 8 + ((number * 19) % 62));
  return button;
}

function resetSequence(field) {
  var nodes = field ? field.querySelectorAll("[data-eci-sequence-node]") : [];
  var index = 0;

  while (index < nodes.length) {
    nodes[index].disabled = false;
    nodes[index].classList.remove("is-complete");
    index += 1;
  }
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
      title: "System Recalibration",
      description: "Complete three steady breathing cycles to stabilize your learning system.",
      startProgress: "Cycles: 0 / 3"
    },
    "kinetic-generator": {
      key: "kinetic-generator",
      title: "Kinetic Generator",
      description: "Generate energy until the system battery reaches full charge.",
      startProgress: "Battery: 0%"
    },
    "malware-purge": {
      key: "malware-purge",
      title: "Malware Purge",
      description: "Clear every moving target from the field.",
      startProgress: "Malware Destroyed: 0 / 15"
    },
    "sequence-lock": {
      key: "sequence-lock",
      title: "Sequence Lock",
      description: "Select the numbered nodes in order to lock focus.",
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
      description: "Complete the five-step launch handshake.",
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
    + '.eci-root{width:100%;box-sizing:border-box;color:#eef7ff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.eci-root *{box-sizing:border-box}.eci-shell{width:min(860px,100%);margin:0 auto;border:1px solid rgba(125,211,252,.28);border-radius:24px;padding:24px;background:radial-gradient(circle at 18% 12%,rgba(45,212,191,.24),transparent 30%),linear-gradient(145deg,#09111f,#121a2f 55%,#08111f);box-shadow:0 24px 70px rgba(2,6,23,.32);overflow:hidden}.eci-header{text-align:center;margin-bottom:20px}.eci-kicker{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(103,232,249,.22);border-radius:999px;padding:6px 10px;background:rgba(8,47,73,.52);color:#67e8f9;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.12em}.eci-header h2,.eci-activity-top h3,.eci-success-card h3{margin:12px 0 6px;font-size:clamp(28px,4vw,46px);line-height:1.02;font-weight:900;letter-spacing:0}.eci-header p,.eci-activity-top p,.eci-success-card p{margin:0;color:#b7c7da;line-height:1.5}.eci-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.eci-mood-card{min-height:132px;border:1px solid rgba(148,163,184,.24);border-radius:20px;background:linear-gradient(180deg,rgba(15,23,42,.84),rgba(30,41,59,.72));color:#fff;padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.eci-mood-card:hover,.eci-mood-card:focus-visible{transform:translateY(-4px);border-color:#22d3ee;box-shadow:0 16px 34px rgba(34,211,238,.18);outline:none}.eci-mood-emoji{font-size:34px}.eci-mood-label{font-size:15px;font-weight:900}.eci-mood-action{font-size:11px;color:#93c5fd;text-transform:uppercase;font-weight:800;letter-spacing:.08em}.eci-activity-card{border:1px solid rgba(148,163,184,.22);border-radius:22px;padding:18px;background:rgba(15,23,42,.62)}.eci-activity-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.eci-activity-top h3{font-size:28px}.eci-back-btn,.eci-final-btn,.eci-success-btn,.eci-generate-btn{border:0;border-radius:14px;padding:12px 16px;font-weight:900;cursor:pointer}.eci-back-btn{background:rgba(148,163,184,.14);color:#cbd5e1;border:1px solid rgba(148,163,184,.24)}.eci-final-btn,.eci-success-btn{width:100%;margin-top:14px;background:linear-gradient(135deg,#10b981,#22c55e);color:#052e16;box-shadow:0 14px 28px rgba(34,197,94,.24)}.eci-final-btn:disabled{cursor:not-allowed;opacity:.42;box-shadow:none}.eci-activity-area{position:relative;min-height:270px;margin-top:16px;border-radius:20px;border:1px solid rgba(59,130,246,.18);background:linear-gradient(145deg,rgba(15,23,42,.78),rgba(8,47,73,.42));overflow:hidden}.eci-progress{margin-top:12px;color:#a7f3d0;font-weight:900}.eci-status{min-height:24px;margin-top:6px;color:#fef08a;font-weight:900}.eci-breathing{min-height:270px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}.eci-breathing-orb{width:132px;height:132px;border-radius:999px;background:radial-gradient(circle,#e0f2fe,#22d3ee 46%,#0f766e 78%);box-shadow:0 0 38px rgba(34,211,238,.62);transform:scale(1);transition:transform .8s ease}.eci-breathing-orb.is-breathe-out{transform:scale(.64)}.eci-breathing-text{font-size:24px;font-weight:900;color:#f8fafc}.eci-battery-wrap{min-height:270px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}.eci-battery{position:relative;width:min(340px,78%);height:88px;border:4px solid #dbeafe;border-radius:18px;padding:8px;background:rgba(15,23,42,.88)}.eci-battery:after{content:"";position:absolute;right:-20px;top:24px;width:14px;height:32px;border-radius:0 9px 9px 0;background:#dbeafe}.eci-battery-fill{height:100%;width:0;border-radius:10px;background:#f59e0b;transition:width .12s linear,background .2s ease}.eci-generate-btn{background:#facc15;color:#422006;box-shadow:0 14px 32px rgba(250,204,21,.24)}.eci-malware-field,.eci-sequence-field,.eci-defrag-field{position:relative;width:100%;height:270px}.eci-ship{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);font-size:34px;filter:drop-shadow(0 0 14px rgba(96,165,250,.7))}.eci-bug,.eci-sequence-node,.eci-block{position:absolute;transform:translate(-50%,-50%);border:0;cursor:pointer}.eci-bug{width:42px;height:42px;border-radius:14px;background:rgba(239,68,68,.16);font-size:25px}.eci-bug:focus-visible,.eci-sequence-node:focus-visible,.eci-block:focus-visible,.eci-handshake:focus-visible{outline:3px solid #67e8f9;outline-offset:3px}.eci-bug.is-destroyed{opacity:0;transform:translate(-50%,-50%) scale(1.8);transition:all .22s ease}.eci-laser{position:absolute;width:12px;height:12px;border-radius:999px;background:#fef08a;box-shadow:0 0 22px #facc15;pointer-events:none;animation:eci-pop .22s ease forwards}.eci-sequence-node{width:46px;height:46px;border-radius:999px;background:#eff6ff;color:#0f172a;font-weight:900;box-shadow:0 10px 20px rgba(15,23,42,.18)}.eci-sequence-node.is-complete{background:#22c55e;color:#052e16}.eci-rack{position:absolute;left:16px;right:16px;bottom:14px;min-height:58px;border:1px dashed rgba(196,181,253,.48);border-radius:16px;background:rgba(88,28,135,.18);display:flex;align-items:center;gap:6px;padding:8px;z-index:2}.eci-block{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#c084fc,#7c3aed);box-shadow:0 10px 22px rgba(124,58,237,.24)}.eci-block.is-sorted{position:static;transform:none;opacity:.9;transition:opacity .2s ease}.eci-defrag-field.is-complete .eci-block{animation:eci-fade .5s ease forwards}.eci-handshake{min-height:270px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;touch-action:none}.eci-handshake-hand{font-size:76px;filter:drop-shadow(0 0 24px rgba(45,212,191,.32));transition:transform .18s ease}.eci-handshake-hand.is-pulsing{transform:scale(1.22) rotate(-8deg)}.eci-handshake-instruction{font-size:18px;font-weight:900;color:#dbeafe}.eci-success-card{text-align:center;border-radius:22px;padding:30px;background:linear-gradient(145deg,rgba(20,184,166,.18),rgba(37,99,235,.14));border:1px solid rgba(125,211,252,.28)}.eci-success-orb{width:86px;height:86px;margin:0 auto 14px;border-radius:999px;display:grid;place-items:center;background:#22c55e;color:#052e16;font-size:42px;font-weight:900;box-shadow:0 0 34px rgba(34,197,94,.36)}@keyframes eci-pop{to{opacity:0;transform:scale(3)}}@keyframes eci-fade{to{opacity:0;transform:scale(.8)}}@media (max-width:720px){.eci-shell{padding:16px;border-radius:18px}.eci-grid{grid-template-columns:1fr}.eci-activity-top{flex-direction:column}.eci-back-btn{width:100%}.eci-header h2{font-size:32px}}'
    + '</style>';
}
