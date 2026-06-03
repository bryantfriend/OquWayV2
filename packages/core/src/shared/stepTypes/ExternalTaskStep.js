import { BaseStep } from "./BaseStep.js?v=1.1.29-module-render-fix";

export class ExternalTaskStep extends BaseStep {
  static get type() {
    return "externalTask";
  }

  static get label() {
    return "External Task";
  }

  static get description() {
    return "Real-world or software task submitted for teacher review.";
  }

  static get category() {
    return "Assessment";
  }

  static get complexity() {
    return "Medium";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "teacherReview";
  }

  static get defaultConfig() {
    return {
      title: "Create a PowerPoint slide",
      instructions: "Open PowerPoint and create one slide about internet safety.",
      checklist: [
        "Slide has a title",
        "Slide has one image",
        "Slide uses readable font",
        "Student saved the file"
      ],
      proofRequired: "true",
      allowedProofTypes: "image,document",
      allowStudentNote: "true",
      maxFiles: 3,
      maxFileSizeMb: 10,
      referenceUrl: "",
      completionMode: "teacherReview"
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Task Title", type: "text" },
        { key: "instructions", label: "Instructions", type: "textarea" },
        { key: "checklist", label: "Checklist (one item per line)", type: "textarea" },
        {
          key: "proofRequired",
          label: "Proof Required",
          type: "select",
          options: [
            { value: "true", label: "Required" },
            { value: "false", label: "Optional" }
          ]
        },
        { key: "allowedProofTypes", label: "Allowed Proof Types", type: "text" },
        {
          key: "allowStudentNote",
          label: "Student Note",
          type: "select",
          options: [
            { value: "true", label: "Allowed" },
            { value: "false", label: "Hidden" }
          ]
        },
        { key: "maxFiles", label: "Max Files", type: "number" },
        { key: "maxFileSizeMb", label: "Max File Size MB", type: "number" },
        { key: "referenceUrl", label: "Reference URL", type: "text" },
        {
          key: "completionMode",
          label: "Completion Mode",
          type: "select",
          options: [
            { value: "teacherReview", label: "Teacher Review" }
          ]
        }
      ]
    };
  }

  static createConfig(config) {
    var baseConfig = super.createConfig(config);
    baseConfig.checklist = normalizeChecklist(baseConfig.checklist);
    baseConfig.allowedProofTypes = normalizeProofTypes(baseConfig.allowedProofTypes).join(",");
    baseConfig.proofRequired = readBooleanString(baseConfig.proofRequired, true);
    baseConfig.allowStudentNote = readBooleanString(baseConfig.allowStudentNote, true);
    baseConfig.maxFiles = clampNumber(baseConfig.maxFiles, 1, 6, 3);
    baseConfig.maxFileSizeMb = clampNumber(baseConfig.maxFileSizeMb, 1, 10, 10);
    baseConfig.completionMode = "teacherReview";
    return baseConfig;
  }

  static renderShell(config) {
    return this.renderPlayerShell(config);
  }

  static renderPlayerShell(config) {
    var safeConfig = this.createConfig(config);
    var checklist = normalizeChecklist(safeConfig.checklist);
    var referenceUrl = this.readText(safeConfig, "referenceUrl", "");
    var html = "";

    html += '<article class="oqu-player-step oqu-external-task-step">';
    html += '<div class="oqu-external-task-hero">';
    html += '<div class="oqu-external-task-badge">Teacher reviewed task</div>';
    html += '<h2>' + this.escapeHtml(this.readText(safeConfig, "title", "External Task")) + '</h2>';
    html += '<p>' + this.escapeHtml(this.readText(safeConfig, "instructions", "Complete the task outside OquWay, then upload proof for your teacher.")) + '</p>';
    html += '</div>';
    if (referenceUrl) {
      html += '<a class="oqu-external-task-reference" href="' + this.escapeHtml(referenceUrl) + '" target="_blank" rel="noopener">Open reference</a>';
    }
    html += '<div class="oqu-external-task-grid">';
    html += '<section><h3>Checklist</h3><ul>';
    checklist.forEach(function (item) {
      html += '<li><span>✓</span>' + BaseStep.escapeHtml(item) + '</li>';
    });
    html += '</ul></section>';
    html += '<section><h3>Upload Proof</h3>';
    html += '<label class="oqu-external-task-dropzone">Select files<input type="file" class="oqu-external-task-files" multiple accept="' + this.escapeHtml(readAcceptAttribute(safeConfig)) + '"></label>';
    html += '<div class="oqu-external-task-file-hint">Up to ' + safeConfig.maxFiles + ' file(s), ' + safeConfig.maxFileSizeMb + ' MB each.</div>';
    if (safeConfig.allowStudentNote === "true") {
      html += '<textarea class="oqu-external-task-note" placeholder="Optional note for your teacher"></textarea>';
    }
    html += '<div class="oqu-external-task-status" aria-live="polite"></div>';
    html += '<button type="button" class="oqu-external-task-submit">Submit for teacher review</button>';
    html += '</section>';
    html += '</div>';
    html += '</article>';

    return html;
  }

  static renderPlayer(container, config, callbacks) {
    var safeConfig = this.createConfig(config);
    container.innerHTML = this.renderPlayerShell(safeConfig);
    attachExternalTaskHandlers(container, safeConfig, callbacks);
  }
}

function attachExternalTaskHandlers(container, config, callbacks) {
  var button = container.querySelector(".oqu-external-task-submit");
  var status = container.querySelector(".oqu-external-task-status");
  var filesInput = container.querySelector(".oqu-external-task-files");
  var noteInput = container.querySelector(".oqu-external-task-note");
  var latestSubmission = null;

  if (!button) {
    return;
  }

  if (callbacks && typeof callbacks.onExternalTaskLoad === "function") {
    callbacks.onExternalTaskLoad().then(function (result) {
      latestSubmission = result && result.submission ? result.submission : null;
      applySubmissionState(container, latestSubmission, callbacks);
    }).catch(function () {
      writeStatus(status, "");
    });
  }

  button.addEventListener("click", async function () {
    if (button.classList.contains("oqu-player-complete-btn")) {
      return;
    }

    var files = filesInput && filesInput.files ? Array.prototype.slice.call(filesInput.files) : [];

    if (config.proofRequired === "true" && files.length === 0) {
      writeStatus(status, "Add a screenshot or file proof before submitting.");
      return;
    }

    if (files.length > config.maxFiles) {
      writeStatus(status, "This task allows up to " + config.maxFiles + " file(s).");
      return;
    }

    button.disabled = true;
    writeStatus(status, "Uploading proof...");

    try {
      if (callbacks && typeof callbacks.onExternalTaskSubmit === "function") {
        await callbacks.onExternalTaskSubmit({
          config: config,
          files: files,
          studentNote: noteInput ? noteInput.value : "",
          previousSubmission: latestSubmission,
          isResubmission: shouldAllowResubmission(latestSubmission)
        });
      }
      writeStatus(status, "Submitted for teacher review");
      button.disabled = true;
      button.textContent = "Submitted";
    } catch (error) {
      button.disabled = false;
      writeStatus(status, error && error.message ? error.message : "Could not submit this task yet.");
    }
  });
}

function applySubmissionState(container, submission, callbacks) {
  var status = container.querySelector(".oqu-external-task-status");
  var button = container.querySelector(".oqu-external-task-submit");

  if (!submission) {
    writeStatus(status, "Status: not submitted yet.");
    return;
  }

  if (submission.reviewStatus === "complete") {
    writeStatus(status, "Status: complete. " + readFeedbackMessage(submission, "Teacher marked this task complete."));
    if (button) {
      button.textContent = "Completed";
      button.classList.add("oqu-player-complete-btn");
      button.disabled = false;
    }
    emitExternalTaskCompleteOnce(container, submission, callbacks);
    return;
  }

  if (submission.reviewStatus === "needsWork") {
    writeStatus(status, "Status: needs work. " + readFeedbackMessage(submission, "Review your task and resubmit."));
    if (button) {
      button.textContent = "Resubmit for review";
      button.disabled = false;
      button.classList.remove("oqu-player-complete-btn");
    }
    return;
  }

  if (submission.reviewStatus === "incomplete") {
    writeStatus(status, "Status: incomplete. " + readFeedbackMessage(submission, "Please resubmit your proof."));
    if (button) {
      button.textContent = "Resubmit for review";
      button.disabled = false;
      button.classList.remove("oqu-player-complete-btn");
    }
    return;
  }

  writeStatus(status, "Status: pending teacher review.");
  if (button) {
    button.textContent = "Submitted";
    button.disabled = true;
  }
}

function emitExternalTaskCompleteOnce(container, submission, callbacks) {
  if (!callbacks || typeof callbacks.onComplete !== "function") {
    return;
  }

  if (container.getAttribute("data-external-task-complete-emitted") === "true") {
    return;
  }

  container.setAttribute("data-external-task-complete-emitted", "true");
  callbacks.onComplete({
    success: true,
    score: 100,
    data: {
      submissionId: submission.id || "",
      reviewStatus: submission.reviewStatus || "complete",
      teacherFeedback: submission.teacherFeedback || ""
    }
  });
}

function shouldAllowResubmission(submission) {
  return Boolean(submission && (submission.reviewStatus === "needsWork" || submission.reviewStatus === "incomplete"));
}

function readFeedbackMessage(submission, fallbackText) {
  return submission && submission.teacherFeedback ? submission.teacherFeedback : fallbackText;
}

function writeStatus(statusElement, message) {
  if (statusElement) {
    statusElement.textContent = message;
  }
}

function normalizeChecklist(value) {
  if (Array.isArray(value)) {
    return value.map(readText).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/\r?\n|,/).map(readText).filter(Boolean);
  }

  return [];
}

function normalizeProofTypes(value) {
  var source = Array.isArray(value) ? value : String(value || "image,document").split(",");
  var result = [];
  source.forEach(function (item) {
    var normalized = readText(item).toLowerCase();
    if ((normalized === "image" || normalized === "document") && result.indexOf(normalized) === -1) {
      result.push(normalized);
    }
  });
  return result.length > 0 ? result : ["image", "document"];
}

function readAcceptAttribute(config) {
  var types = normalizeProofTypes(config.allowedProofTypes);
  var values = [];
  if (types.indexOf("image") !== -1) {
    values.push(".png", ".jpg", ".jpeg", ".webp", "image/png", "image/jpeg", "image/webp");
  }
  if (types.indexOf("document") !== -1) {
    values.push(".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".csv", "application/pdf", "text/plain", "text/csv");
  }
  return values.join(",");
}

function readBooleanString(value, fallback) {
  if (value === true || value === "true") {
    return "true";
  }

  if (value === false || value === "false") {
    return "false";
  }

  return fallback ? "true" : "false";
}

function clampNumber(value, min, max, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, Math.round(numberValue)));
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}
