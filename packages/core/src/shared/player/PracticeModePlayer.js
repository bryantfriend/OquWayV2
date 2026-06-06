import {
  createDefaultStepConfig,
  getStepTypeDefinition
} from "../stepTypes/stepTypeRegistry.js?v=1.1.79-user-command-center";

export class PracticeModePlayer {
  constructor(options) {
    this.configure(options);
  }

  configure(options) {
    var safeOptions = options && typeof options === "object" ? options : {};

    this.courseId = readString(safeOptions.courseId, "");
    this.moduleId = readString(safeOptions.moduleId, "");
    this.sessionId = readString(safeOptions.sessionId, "");
    this.practiceModeKey = readString(safeOptions.practiceModeKey, "beforeClass");
    this.practiceMode = readObject(safeOptions.practiceMode);
    this.steps = readSortedSteps(safeOptions.steps);
    this.actor = readObject(safeOptions.actor);
    this.mode = safeOptions.mode === "student" ? "student" : "playtest";
    this.container = null;
    this.currentStepIndex = 0;
    this.completedStepIds = [];
    this.completionResults = {};
    this.warningMessage = "";
    this.isComplete = false;
    this.onBack = typeof safeOptions.onBack === "function" ? safeOptions.onBack : null;
    this.onStateChange = typeof safeOptions.onStateChange === "function" ? safeOptions.onStateChange : null;
    this.onStepComplete = typeof safeOptions.onStepComplete === "function" ? safeOptions.onStepComplete : null;
    this.onExternalTaskSubmit = typeof safeOptions.onExternalTaskSubmit === "function" ? safeOptions.onExternalTaskSubmit : null;
    this.onExternalTaskLoad = typeof safeOptions.onExternalTaskLoad === "function" ? safeOptions.onExternalTaskLoad : null;
    this.backLabel = readString(safeOptions.backLabel, "");
    this.handleClick = this.handleClick.bind(this);
    this.applyInitialProgress(safeOptions);
    this.currentStepIndex = clampNumber(readNumber(safeOptions.initialStepIndex, this.currentStepIndex), 0, Math.max(this.steps.length - 1, 0));
  }

  applyInitialProgress(options) {
    var stepIds = Array.isArray(options.initialCompletedStepIds) ? options.initialCompletedStepIds : [];
    var completionResults = readObject(options.initialCompletionResults);
    var stepIndex = 0;

    while (stepIndex < stepIds.length) {
      if (typeof stepIds[stepIndex] === "string" && stepIds[stepIndex].length > 0) {
        this.completedStepIds.push(stepIds[stepIndex]);
      }

      stepIndex = stepIndex + 1;
    }

    this.completionResults = Object.assign({}, completionResults);

    if (options.initialCompleted === true && this.steps.length > 0) {
      this.isComplete = true;
    }
  }

  mount(container) {
    if (!container) {
      return;
    }

    this.container = container;
    this.container.removeEventListener("click", this.handleClick);
    this.container.addEventListener("click", this.handleClick);
    this.render();
  }

  destroy() {
    if (this.container) {
      this.container.removeEventListener("click", this.handleClick);
    }

    this.container = null;
  }

  render() {
    if (!this.container) {
      return;
    }

    if (this.steps.length === 0) {
      this.container.innerHTML = this.buildEmptyHtml();
      return;
    }

    this.currentStepIndex = clampNumber(this.currentStepIndex, 0, this.steps.length - 1);

    if (this.isComplete) {
      this.container.innerHTML = this.buildCompleteHtml();
      return;
    }

    this.container.innerHTML = this.buildPlayerHtml();
    this.renderCurrentStep();
  }

  renderCurrentStep() {
    var target = document.getElementById("course-player-step-render-target");
    var step = this.readCurrentStep();
    var StepTypeDefinition = getStepTypeDefinition(readStepType(step));
    var config = createDefaultStepConfig(readStepType(step), readStepConfig(step));
    var self = this;

    if (!target) {
      return;
    }

    if (StepTypeDefinition && typeof StepTypeDefinition.renderPlayer === "function") {
      try {
        StepTypeDefinition.renderPlayer(target, config, {
          context: this.createCurrentStepContext(step),
          onExternalTaskLoad: function () {
            if (self.onExternalTaskLoad) {
              return self.onExternalTaskLoad(step, self.createStateSnapshot());
            }
            return Promise.resolve(null);
          },
          onExternalTaskSubmit: function (submissionRequest) {
            if (self.onExternalTaskSubmit) {
              return self.onExternalTaskSubmit(step, submissionRequest, self.createStateSnapshot());
            }
            return Promise.reject(new Error("External task submission is not available here."));
          },
          onComplete: function (completionResult) {
            self.completeCurrentStep(completionResult);
          }
        });
        return;
      } catch (error) {
        target.innerHTML = this.buildFallbackStepHtml(step, "This step had trouble rendering, but the player stayed safe.");
        return;
      }
    }

    target.innerHTML = this.buildFallbackStepHtml(step, "This step type cannot be played yet, but it is safely stored.");
  }

  handleClick(event) {
    var target = event.target;
    var backButton = null;
    var previousButton = null;
    var nextButton = null;
    var completeButton = null;
    var restartButton = null;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    backButton = target.closest(".course-player-back-btn");
    previousButton = target.closest(".course-player-previous-btn");
    nextButton = target.closest(".course-player-next-btn");
    completeButton = target.closest(".course-player-complete-btn");
    restartButton = target.closest(".course-player-restart-btn");

    if (backButton) {
      event.preventDefault();
      this.requestBack();
      return;
    }

    if (previousButton) {
      event.preventDefault();
      this.movePrevious();
      return;
    }

    if (nextButton) {
      event.preventDefault();
      this.moveNext();
      return;
    }

    if (completeButton) {
      event.preventDefault();
      this.completeCurrentStep(createDefaultCompletionResult());
      return;
    }

    if (restartButton) {
      event.preventDefault();
      this.restart();
    }
  }

  requestBack() {
    if (this.onBack) {
      this.onBack(this.createStateSnapshot());
    }
  }

  movePrevious() {
    this.warningMessage = "";

    if (this.currentStepIndex > 0) {
      this.currentStepIndex = this.currentStepIndex - 1;
    }

    this.emitStateChange();
    this.render();
  }

  moveNext() {
    var step = this.readCurrentStep();
    var stepId = readStepId(step, "");
    var completed = this.isStepCompleted(stepId);

    if (!completed && this.mode !== "playtest") {
      this.warningMessage = "Complete this step before moving forward.";
      this.render();
      return;
    }

    if (!completed && this.mode === "playtest") {
      this.warningMessage = "Playtest skip: this step was not completed.";
    } else {
      this.warningMessage = "";
    }

    if (this.currentStepIndex >= this.steps.length - 1) {
      if (completed) {
        this.isComplete = true;
      }
    } else {
      this.currentStepIndex = this.currentStepIndex + 1;
    }

    this.emitStateChange();
    this.render();
  }

  completeCurrentStep(completionResult) {
    var step = this.readCurrentStep();
    var stepId = readStepId(step, "");
    var safeResult = createSafeCompletionResult(completionResult);
    var snapshot = null;

    if (stepId) {
      if (!this.isStepCompleted(stepId)) {
        this.completedStepIds.push(stepId);
      }

      this.completionResults[stepId] = safeResult;
    }

    this.warningMessage = "";

    if (this.currentStepIndex >= this.steps.length - 1) {
      this.isComplete = true;
    }

    snapshot = this.createStateSnapshot();

    if (this.onStepComplete) {
      this.onStepComplete(step, safeResult, snapshot);
    }

    this.emitStateChange();
    this.render();
  }

  restart() {
    this.currentStepIndex = 0;
    this.completedStepIds = [];
    this.completionResults = {};
    this.warningMessage = "";
    this.isComplete = false;
    this.emitStateChange();
    this.render();
  }

  emitStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.createStateSnapshot());
    }
  }

  createStateSnapshot() {
    return {
      courseId: this.courseId,
      moduleId: this.moduleId,
      sessionId: this.sessionId,
      practiceModeKey: this.practiceModeKey,
      mode: this.mode,
      currentStepIndex: this.currentStepIndex,
      stepCount: this.steps.length,
      completedStepIds: this.completedStepIds.slice(),
      completionResults: Object.assign({}, this.completionResults),
      isComplete: this.isComplete
    };
  }

  readCurrentStep() {
    if (this.steps.length === 0) {
      return null;
    }

    return this.steps[clampNumber(this.currentStepIndex, 0, this.steps.length - 1)];
  }

  createCurrentStepContext(step) {
    return {
      courseId: this.courseId,
      moduleId: this.moduleId,
      sessionId: this.sessionId,
      practiceModeKey: this.practiceModeKey,
      modeId: this.practiceModeKey,
      stepId: readStepId(step, ""),
      actor: this.actor
    };
  }

  isStepCompleted(stepId) {
    if (!stepId) {
      return false;
    }

    return this.completedStepIds.indexOf(stepId) !== -1;
  }

  buildPlayerHtml() {
    var step = this.readCurrentStep();
    var practiceModeTitle = readLocalizedText(this.practiceMode.title, "Practice Mode");
    var stepTitle = readLocalizedText(step.title, "Step");
    var stepId = readStepId(step, "");
    var completed = this.isStepCompleted(stepId);
    var progress = calculateProgressPercent(this.currentStepIndex, this.steps.length, this.isComplete);
    var nextDisabled = this.mode === "student" && !completed ? " disabled" : "";
    var previousDisabled = this.currentStepIndex === 0 ? " disabled" : "";
    var nextLabel = this.currentStepIndex >= this.steps.length - 1 ? "Finish" : "Next";
    var completeLabel = this.currentStepIndex >= this.steps.length - 1 ? "Complete Practice Mode" : "Complete Step";
    var html = "";

    html += '<section class="course-player-shell course-player-shell-' + this.mode + '">';
    html += '<div class="course-player-topbar">';
    html += '<button type="button" class="course-player-back-btn back-to-editor-btn">Back to ' + this.readBackLabel() + '</button>';
    html += '<div class="course-player-title-block">';
    html += '<div class="course-player-kicker">' + this.readModeLabel() + '</div>';
    html += '<h1>' + escapeHtml(practiceModeTitle) + '</h1>';
    html += '<p>' + escapeHtml(stepTitle) + '</p>';
    html += '</div>';
    html += '<div class="course-player-step-count">Step ' + (this.currentStepIndex + 1) + ' of ' + this.steps.length + '</div>';
    html += '</div>';
    html += '<div class="course-player-progress-track">';
    html += '<div class="course-player-progress-fill" style="width:' + progress + '%"></div>';
    html += '</div>';
    if (this.warningMessage) {
      html += '<div class="course-player-warning">' + escapeHtml(this.warningMessage) + '</div>';
    }
    html += '<div class="course-player-stage">';
    html += '<div class="course-player-step-card">';
    html += '<div id="course-player-step-render-target" class="course-player-render-target"></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="course-player-footer">';
    html += '<button type="button" class="course-player-previous-btn course-player-nav-btn"' + previousDisabled + '>Previous</button>';
    html += '<button type="button" class="course-player-complete-btn">' + completeLabel + '</button>';
    html += '<button type="button" class="course-player-next-btn course-player-nav-btn"' + nextDisabled + '>' + nextLabel + '</button>';
    html += '</div>';
    if (this.mode === "playtest") {
      html += '<div class="course-player-skip-note">Playtest mode allows skipping so admins can inspect the whole flow quickly.</div>';
    }
    html += '</section>';

    return html;
  }

  buildEmptyHtml() {
    var practiceModeTitle = readLocalizedText(this.practiceMode.title, "Practice Mode");
    var html = "";

    html += '<section class="course-player-shell course-player-empty-shell">';
    html += '<div class="course-player-topbar">';
    html += '<button type="button" class="course-player-back-btn back-to-editor-btn">Back to ' + this.readBackLabel() + '</button>';
    html += '<div class="course-player-title-block">';
    html += '<div class="course-player-kicker">' + this.readModeLabel() + '</div>';
    html += '<h1>' + escapeHtml(practiceModeTitle) + '</h1>';
    html += '<p>No activities to play yet</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="course-player-empty-state">';
    html += '<div class="course-player-empty-icon">📚</div>';
    html += '<h2>No activities yet</h2>';
    html += '<p>Add steps to this practice mode, then come back to test the learner flow from start to finish.</p>';
    html += '</div>';
    html += '</section>';

    return html;
  }

  buildCompleteHtml() {
    var practiceModeTitle = readLocalizedText(this.practiceMode.title, "Practice Mode");
    var completedCount = this.completedStepIds.length;
    var score = calculateAverageScore(this.completionResults);
    var html = "";

    html += '<section class="course-player-shell course-player-complete-shell">';
    html += '<div class="course-player-topbar">';
    html += '<button type="button" class="course-player-back-btn back-to-editor-btn">Back to ' + this.readBackLabel() + '</button>';
    html += '<div class="course-player-title-block">';
    html += '<div class="course-player-kicker">' + this.readModeLabel() + '</div>';
    html += '<h1>' + escapeHtml(practiceModeTitle) + '</h1>';
    html += '<p>Practice Mode Complete</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="course-player-progress-track">';
    html += '<div class="course-player-progress-fill" style="width:100%"></div>';
    html += '</div>';
    html += '<div class="course-player-complete-card">';
    html += '<div class="course-player-complete-icon">✓</div>';
    html += '<h2>Practice Mode Complete</h2>';
    html += '<p>You reached the end of this practice flow.</p>';
    html += '<div class="course-player-summary-grid">';
    html += '<div><strong>' + completedCount + '</strong><span>Steps completed</span></div>';
    html += '<div><strong>' + this.steps.length + '</strong><span>Total steps</span></div>';
    html += '<div><strong>' + score + '%</strong><span>Average score</span></div>';
    html += '<div><strong>Coming soon</strong><span>Time estimate</span></div>';
    html += '</div>';
    html += '<div class="course-player-complete-actions">';
    html += '<button type="button" class="course-player-restart-btn">Play Again</button>';
    html += '<button type="button" class="course-player-back-btn back-to-editor-btn">Back to ' + this.readBackLabel() + '</button>';
    html += '</div>';
    html += '</div>';
    html += '</section>';

    return html;
  }

  buildFallbackStepHtml(step, message) {
    var stepType = readStepType(step);
    var title = readLocalizedText(step.title, "Unsupported Step");
    var safeType = stepType ? stepType : "unknown";
    var html = "";

    html += '<article class="oqu-player-step course-player-fallback-step">';
    html += '<h2>' + escapeHtml(title) + '</h2>';
    html += '<div class="course-player-fallback-label">Unsupported step type</div>';
    html += '<p>' + escapeHtml(message) + '</p>';
    html += '<div class="course-player-fallback-type">Type: ' + escapeHtml(safeType) + '</div>';
    html += '</article>';

    return html;
  }

  readModeLabel() {
    if (this.mode === "student") {
      return "Student Practice";
    }

    return "Practice Mode Playtest";
  }

  readBackLabel() {
    if (this.backLabel) {
      return this.backLabel;
    }

    if (this.mode === "student") {
      return "Session";
    }

    return "Editor";
  }
}

function readSortedSteps(steps) {
  var safeSteps = Array.isArray(steps) ? steps.slice() : [];

  safeSteps.sort(function (firstStep, secondStep) {
    return readNumber(firstStep.order, 0) - readNumber(secondStep.order, 0);
  });

  return safeSteps;
}

function readObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function readString(value, fallbackText) {
  if (typeof value !== "string") {
    return fallbackText;
  }

  return value;
}

function readNumber(value, fallbackNumber) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallbackNumber;
}

function readLocalizedText(value, fallbackText) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value === "object" && typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  return fallbackText;
}

function readStepType(step) {
  if (!step || typeof step.type !== "string") {
    return "";
  }

  return step.type;
}

function readStepId(step, fallbackText) {
  if (!step || typeof step.id !== "string") {
    return fallbackText;
  }

  return step.id;
}

function readStepConfig(step) {
  if (!step || !step.config || typeof step.config !== "object" || Array.isArray(step.config)) {
    return {};
  }

  return step.config;
}

function createDefaultCompletionResult() {
  return {
    success: true,
    score: 100,
    data: {}
  };
}

function createSafeCompletionResult(completionResult) {
  var safeResult = completionResult && typeof completionResult === "object" ? completionResult : {};
  var score = readNumber(safeResult.score, 100);
  var data = readObject(safeResult.data);

  return {
    success: safeResult.success === false ? false : true,
    score: score,
    data: data
  };
}

function calculateProgressPercent(stepIndex, stepCount, isComplete) {
  if (stepCount <= 0) {
    return 0;
  }

  if (isComplete) {
    return 100;
  }

  return Math.round(((stepIndex + 1) / stepCount) * 100);
}

function calculateAverageScore(completionResults) {
  var keys = Object.keys(completionResults);
  var keyIndex = 0;
  var scoreTotal = 0;
  var scoreCount = 0;

  while (keyIndex < keys.length) {
    var result = completionResults[keys[keyIndex]];
    if (result && typeof result.score === "number" && Number.isFinite(result.score)) {
      scoreTotal = scoreTotal + result.score;
      scoreCount = scoreCount + 1;
    }
    keyIndex = keyIndex + 1;
  }

  if (scoreCount === 0) {
    return 0;
  }

  return Math.round(scoreTotal / scoreCount);
}

function clampNumber(value, minimumValue, maximumValue) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return minimumValue;
  }

  if (value < minimumValue) {
    return minimumValue;
  }

  if (value > maximumValue) {
    return maximumValue;
  }

  return value;
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
