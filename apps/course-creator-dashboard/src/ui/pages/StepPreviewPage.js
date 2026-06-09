import { moduleEditorService } from "../services/moduleEditorService.js?v=1.1.154-emotional-check-in-prototype";
import { PracticeModePlayer } from "../../../../../packages/shared/player/index.js?v=1.1.159-emotional-regulation";
import {
  createDefaultStepConfig,
  getStepTypeDefinition
} from "../../../../../packages/domain/steps/index.js?v=1.1.159-emotional-regulation";

export class StepPreviewPage {
  constructor(courseId, moduleId, modeId, stepId) {
    this.courseId = courseId || "";
    this.moduleId = moduleId || "";
    this.modeId = modeId || "";
    this.stepId = stepId || "";
    this.player = null;
    this.previewData = null;
    this.error = null;
  }

  render() {
    return `
      <div id="step-preview-page" class="min-h-screen bg-slate-100">
        ${this.buildLoadingHtml()}
      </div>
    `;
  }

  attachEvents() {
    var root = document.getElementById("step-preview-page");
    var self = this;

    if (root) {
      root.addEventListener("click", function (event) {
        var backButton = event.target.closest(".step-preview-back-btn");
        if (!backButton) {
          return;
        }

        event.preventDefault();
        self.returnToEditor();
      });
    }

    this.loadPreview();
  }

  async loadPreview() {
    var root = document.getElementById("step-preview-page");

    console.info("[step-preview]", {
      courseId: this.courseId,
      moduleId: this.moduleId,
      modeId: this.modeId,
      stepId: this.stepId
    });

    if (!root) {
      return;
    }

    root.innerHTML = this.buildLoadingHtml();

    try {
      this.previewData = await moduleEditorService.previewStep(this.courseId, this.moduleId, this.modeId, this.stepId);
      this.error = validatePreviewData(this.previewData, this.stepId);

      if (this.error) {
        root.innerHTML = this.buildErrorHtml(this.error);
        return;
      }

      root.innerHTML = this.buildPreviewHtml(this.previewData);
      this.mountPlayer();
    } catch (error) {
      this.error = error;
      console.warn("[step-preview] Unable to preview step.", {
        courseId: this.courseId,
        moduleId: this.moduleId,
        modeId: this.modeId,
        stepId: this.stepId,
        message: error && error.message ? error.message : String(error)
      });
      root.innerHTML = this.buildErrorHtml(error);
    }
  }

  mountPlayer() {
    var target = document.getElementById("step-preview-player-root");
    var data = this.previewData || {};
    var step = normalizePreviewStep(data.step);
    var learningMode = data.learningMode || {};
    var self = this;

    if (!target || !step) {
      return;
    }

    this.destroyPlayer();

    this.player = new PracticeModePlayer({
      courseId: this.courseId,
      moduleId: this.moduleId,
      sessionId: "",
      practiceModeKey: this.modeId,
      practiceMode: {
        key: this.modeId,
        title: learningMode.title || { en: "Preview Mode", ru: "", ky: "" },
        steps: [step]
      },
      steps: [step],
      actor: {
        id: "course-creator-preview",
        role: "courseCreator"
      },
      mode: "student",
      backLabel: "Editor",
      onBack: function () {
        self.returnToEditor();
      },
      onStepComplete: function (completedStep, completionResult) {
        console.info("[step-preview] Step completed locally.", {
          stepId: readStepId(completedStep, self.stepId),
          score: completionResult && typeof completionResult.score === "number" ? completionResult.score : null,
          savedProgress: false
        });
      }
    });

    this.player.mount(target);
  }

  buildLoadingHtml() {
    return '<div class="step-preview-shell">'
      + this.buildTopbarHtml("Loading preview...")
      + '<main class="step-preview-stage">'
      + '<section class="step-preview-loading" aria-live="polite">'
      + '<span class="step-preview-spinner"></span>'
      + '<div class="step-preview-loading-title">Loading step preview</div>'
      + '<p>No student progress will be saved.</p>'
      + '</section>'
      + '</main>'
      + '</div>';
  }

  buildPreviewHtml(data) {
    var courseTitle = readLocalizedText(data.course && data.course.title, "Course");
    var moduleTitle = readLocalizedText(data.module && data.module.title, "Module");
    var modeTitle = readLocalizedText(data.learningMode && data.learningMode.title, "Learning Mode");
    var stepTitle = readLocalizedText(data.step && data.step.title, "Step Preview");

    return '<div class="step-preview-shell">'
      + this.buildTopbarHtml(stepTitle)
      + '<main class="step-preview-stage">'
      + '<section class="step-preview-context">'
      + '<div><span>Course</span><strong>' + escapeHtml(courseTitle) + '</strong></div>'
      + '<div><span>Module</span><strong>' + escapeHtml(moduleTitle) + '</strong></div>'
      + '<div><span>Mode</span><strong>' + escapeHtml(modeTitle) + '</strong></div>'
      + '</section>'
      + '<div id="step-preview-player-root" class="step-preview-player-root"></div>'
      + '</main>'
      + '</div>';
  }

  buildErrorHtml(error) {
    var explanation = readErrorMessage(error);
    var isMissingStep = explanation.indexOf("Step not found") !== -1 || explanation.indexOf("STEP_PREVIEW_STEP_NOT_FOUND") !== -1;
    var headline = isMissingStep ? "Step missing" : "Unable to preview this step.";
    var body = isMissingStep
      ? "The saved step could not be found at the canonical learning mode path. Return to the editor and save or recreate the step."
      : "The preview could not load the saved step configuration. Return to the editor, check the config, then try again.";

    return '<div class="step-preview-shell">'
      + this.buildTopbarHtml("Preview unavailable")
      + '<main class="step-preview-stage">'
      + '<section class="step-preview-error-state">'
      + '<div class="step-preview-error-icon">!</div>'
      + '<h1>' + escapeHtml(headline) + '</h1>'
      + '<p>' + escapeHtml(body) + '</p>'
      + '<dl>'
      + '<div><dt>stepId</dt><dd>' + escapeHtml(this.stepId || "missing") + '</dd></div>'
      + '<div><dt>Reason</dt><dd>' + escapeHtml(explanation) + '</dd></div>'
      + '</dl>'
      + '<button type="button" class="step-preview-back-btn step-preview-primary-btn">Back to Editor</button>'
      + '</section>'
      + '</main>'
      + '</div>';
  }

  buildTopbarHtml(title) {
    return '<header class="step-preview-topbar">'
      + '<button type="button" class="step-preview-back-btn step-preview-back-link"><i class="fa-solid fa-chevron-left"></i> Back to Editor</button>'
      + '<div class="step-preview-title-block">'
      + '<div class="step-preview-mode-badge">PREVIEW MODE</div>'
      + '<h1>' + escapeHtml(title || "Step Preview") + '</h1>'
      + '<p>No student progress will be saved.</p>'
      + '</div>'
      + '</header>';
  }

  returnToEditor() {
    this.destroyPlayer();
    window.location.hash = "#module-editor?courseId=" + encodeURIComponent(this.courseId)
      + "&moduleId=" + encodeURIComponent(this.moduleId);
  }

  destroyPlayer() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = null;
  }

  destroy() {
    this.destroyPlayer();
  }
}

function validatePreviewData(data, stepId) {
  var step = data && data.step ? data.step : null;
  var stepType = step ? readStepType(step) : "";
  var StepTypeDefinition = getStepTypeDefinition(stepType);

  if (!step) {
    return new Error("Step not found: " + stepId);
  }

  if (!stepType) {
    return new Error("Invalid step config: missing step type.");
  }

  if (!StepTypeDefinition) {
    return new Error("This step type is not registered with the preview renderer. Type: " + stepType + ".");
  }

  if (step.config && (typeof step.config !== "object" || Array.isArray(step.config))) {
    return new Error("Invalid step config: config must be an object.");
  }

  return null;
}

function normalizePreviewStep(step) {
  if (!step) {
    return null;
  }

  return Object.assign({}, step, {
    config: createDefaultStepConfig(readStepType(step), step.config)
  });
}

function readStepType(step) {
  if (!step) {
    return "";
  }

  if (typeof step.type === "string" && step.type.length > 0) {
    return step.type;
  }

  if (typeof step.stepTypeId === "string" && step.stepTypeId.length > 0) {
    return step.stepTypeId;
  }

  return "";
}

function readStepId(step, fallback) {
  if (step && typeof step.id === "string" && step.id.length > 0) {
    return step.id;
  }

  return fallback || "";
}

function readLocalizedText(value, fallbackText) {
  if (typeof value === "string") {
    return value || fallbackText;
  }

  if (value && typeof value === "object") {
    return value.en || value.ru || value.ky || fallbackText;
  }

  return fallbackText;
}

function readErrorMessage(error) {
  if (!error) {
    return "Unknown preview error.";
  }

  if (error.message) {
    return error.message;
  }

  return String(error);
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
