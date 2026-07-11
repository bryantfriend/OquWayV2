import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { canResubmitExternalTaskSubmission } from "../../../../domain/externalTasks/index.js?v=1.1.82-shared-command-center-shell";
import { isExternalTaskReviewComplete } from "../../../../domain/progress/index.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgChecklist } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.85-visual-helpers-syntax";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-external-task-step oqu-enhanced-card" style="max-width: 800px; margin: 0 auto; padding: 40px; border-radius: 24px;">';
    
    html += '<div class="oqu-external-task-hero" style="display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 32px; border-bottom: 1px solid var(--line); padding-bottom: 32px;">';
    html += '<div class="oqu-external-task-badge" style="background: var(--soft-blue); color: var(--blue); padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; display: inline-flex; align-items: center; gap: 8px;">' + buildSvgChecklist() + ' Teacher Reviewed Task</div>';
    html += '<h2 style="font-size: 2.2rem; font-weight: 800; color: var(--ink); margin-bottom: 16px; line-height: 1.2;">' + this.escapeHtml(this.readText(safeConfig, "title", "External Task")) + '</h2>';
    html += '<p style="font-size: 1.15rem; color: var(--muted); line-height: 1.6; max-width: 600px;">' + this.escapeHtml(this.readText(safeConfig, "instructions", "Complete the task outside OquWay, then upload proof for your teacher.")) + '</p>';
    if (referenceUrl) {
      html += '<a class="oqu-external-task-reference oqu-anim-pulse" href="' + this.escapeHtml(referenceUrl) + '" target="_blank" rel="noopener" style="display: inline-block; margin-top: 16px; background: white; color: var(--blue); border: 2px solid var(--blue); padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; transition: background 0.2s, color 0.2s;">Open Reference <i class="fa-solid fa-external-link-alt ml-1"></i></a>';
    }
    html += '</div>';
    
    html += '<div class="oqu-external-task-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">';
    
    html += '<section style="background: var(--bg-color); padding: 24px; border-radius: 16px; border: 1px solid var(--line);">';
    html += '<h3 style="font-size: 1.2rem; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;"><div style="width: 8px; height: 24px; background: var(--blue); border-radius: 4px;"></div> Checklist</h3>';
    html += '<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">';
    checklist.forEach(function (item) {
      html += '<li style="display: flex; align-items: flex-start; gap: 12px; color: var(--ink); font-size: 1rem;"><span style="color: var(--blue); font-weight: bold;">✓</span><span>' + BaseStep.escapeHtml(item) + '</span></li>';
    });
    html += '</ul></section>';
    
    html += '<section style="display: flex; flex-direction: column; gap: 16px;">';
    html += '<h3 style="font-size: 1.2rem; color: var(--ink); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><div style="width: 8px; height: 24px; background: var(--purple); border-radius: 4px;"></div> Upload Proof</h3>';
    
    html += '<label class="oqu-external-task-dropzone" style="display: block; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 32px 24px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: var(--soft-blue);">';
    html += '<div style="font-weight: 700; color: var(--blue); margin-bottom: 8px;">Click to select files</div>';
    html += '<div class="oqu-external-task-file-hint" style="color: #64748b; font-size: 0.9rem;">Up to ' + safeConfig.maxFiles + ' file(s), ' + safeConfig.maxFileSizeMb + ' MB each.</div>';
    html += '<input type="file" class="oqu-external-task-files" multiple accept="' + this.escapeHtml(readAcceptAttribute(safeConfig)) + '" style="display: none;">';
    html += '</label>';
    
    if (safeConfig.allowStudentNote === "true") {
      html += '<textarea class="oqu-external-task-note" placeholder="Optional note for your teacher" style="width: 100%; height: 100px; padding: 16px; border-radius: 12px; border: 1px solid var(--line); font-family: inherit; font-size: 0.95rem; resize: vertical; box-sizing: border-box;"></textarea>';
    }
    
    html += '<div class="oqu-external-task-status" aria-live="polite" style="margin-top: 8px;"></div>';
    html += '<button type="button" class="oqu-external-task-submit" style="background: var(--blue); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; width: 100%; transition: transform 0.2s, background 0.2s;">Submit for Teacher Review</button>';
    
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
    button.classList.add("is-uploading");
    button.textContent = "Uploading proof...";
    writeStatus(status, "Uploading proof...");

    try {
      var result = null;
      if (callbacks && typeof callbacks.onExternalTaskSubmit === "function") {
        result = await callbacks.onExternalTaskSubmit({
          config: config,
          files: files,
          studentNote: noteInput ? noteInput.value : "",
          previousSubmission: latestSubmission,
          previousSubmissionId: latestSubmission ? (latestSubmission.id || latestSubmission.submissionId || "") : "",
          isResubmission: shouldAllowResubmission(latestSubmission)
        });
      }
      latestSubmission = result && result.submission ? result.submission : {
        reviewStatus: "pending",
        status: "submitted",
        files: files.map(function (file) {
          return {
            name: file.name || "upload",
            size: file.size || 0
          };
        })
      };
      writeStatusCard(status, latestSubmission);
      button.disabled = true;
      button.textContent = "Submitted";
    } catch (error) {
      button.disabled = false;
      writeStatus(status, error && error.message ? error.message : "Could not submit this task yet.");
    } finally {
      button.classList.remove("is-uploading");
    }
  });
}

function applySubmissionState(container, submission, callbacks) {
  var status = container.querySelector(".oqu-external-task-status");
  var button = container.querySelector(".oqu-external-task-submit");

  if (!submission) {
    writeStatusCard(status, null);
    return;
  }

  if (isExternalTaskReviewComplete(submission)) {
    writeStatusCard(status, submission);
    if (button) {
      button.textContent = "Completed";
      button.classList.add("oqu-player-complete-btn");
      button.disabled = false;
    }
    emitExternalTaskCompleteOnce(container, submission, callbacks);
    return;
  }

  if (submission.reviewStatus === "needsWork") {
    writeStatusCard(status, submission);
    if (button) {
      button.textContent = "Resubmit for review";
      button.disabled = false;
      button.classList.remove("oqu-player-complete-btn");
    }
    return;
  }

  if (submission.reviewStatus === "incomplete") {
    writeStatusCard(status, submission);
    if (button) {
      button.textContent = "Resubmit for review";
      button.disabled = false;
      button.classList.remove("oqu-player-complete-btn");
    }
    return;
  }

  writeStatusCard(status, submission);
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
  return canResubmitExternalTaskSubmission(submission);
}

function writeStatusCard(statusElement, submission) {
  if (!statusElement) {
    return;
  }

  if (!submission) {
    statusElement.innerHTML = '<div class="oqu-external-task-status-card oqu-external-task-status-empty">'
      + '<strong>No submission yet</strong>'
      + '<span>Upload proof when your task is ready.</span>'
      + '</div>';
    return;
  }

  var reviewStatus = submission.reviewStatus || "pending";
  var statusCopy = readStatusCopy(reviewStatus);
  var html = "";

  html += '<div class="oqu-external-task-status-card oqu-external-task-status-' + escapeClassName(reviewStatus) + '">';
  html += '<strong>' + BaseStep.escapeHtml(statusCopy.title) + '</strong>';
  html += '<span>' + BaseStep.escapeHtml(statusCopy.message) + '</span>';

  if (submission.teacherFeedback) {
    html += '<p><b>Teacher feedback:</b> ' + BaseStep.escapeHtml(submission.teacherFeedback) + '</p>';
  }

  html += '<dl>';
  html += '<div><dt>Attempt</dt><dd>' + BaseStep.escapeHtml(String(submission.attemptNumber || 1)) + '</dd></div>';
  html += '<div><dt>Submitted</dt><dd>' + BaseStep.escapeHtml(formatDateTime(submission.createdAt || submission.updatedAt)) + '</dd></div>';
  if (submission.reviewedAt) {
    html += '<div><dt>Reviewed</dt><dd>' + BaseStep.escapeHtml(formatDateTime(submission.reviewedAt)) + '</dd></div>';
  }
  html += '</dl>';

  html += buildSubmittedFileList(submission.files);
  html += '</div>';

  statusElement.innerHTML = html;
}

function readStatusCopy(reviewStatus) {
  if (reviewStatus === "complete") {
    return {
      title: "Complete",
      message: "Great work! Your teacher marked this complete."
    };
  }

  if (reviewStatus === "needsWork") {
    return {
      title: "Needs Work",
      message: "Read your teacher feedback, improve the work, then resubmit."
    };
  }

  if (reviewStatus === "incomplete") {
    return {
      title: "Incomplete",
      message: "Read your teacher feedback and resubmit when it is complete."
    };
  }

  return {
    title: "Pending",
    message: "Submitted for teacher review."
  };
}

function buildSubmittedFileList(files) {
  var safeFiles = Array.isArray(files) ? files : [];
  var html = "";
  var index = 0;

  if (safeFiles.length === 0) {
    return "";
  }

  html += '<div class="oqu-external-task-files-list"><b>Submitted files</b><ul>';

  while (index < safeFiles.length) {
    html += '<li>' + buildSubmittedFileLink(safeFiles[index]) + '</li>';
    index = index + 1;
  }

  html += '</ul></div>';
  return html;
}

function buildSubmittedFileLink(file) {
  var name = file && file.name ? file.name : "Uploaded file";
  var size = file && file.size ? " · " + formatFileSize(file.size) : "";

  if (file && file.downloadUrl) {
    return '<a href="' + BaseStep.escapeHtml(file.downloadUrl) + '" target="_blank" rel="noopener">' + BaseStep.escapeHtml(name) + '</a><span>' + BaseStep.escapeHtml(size) + '</span>';
  }

  return '<span>' + BaseStep.escapeHtml(name + size) + '</span>';
}

function formatDateTime(value) {
  var millis = readMillis(value);

  if (!millis) {
    return "Just now";
  }

  try {
    return new Date(millis).toLocaleString();
  } catch (error) {
    return "";
  }
}

function readMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
}

function formatFileSize(size) {
  var safeSize = Number(size) || 0;

  if (safeSize >= 1024 * 1024) {
    return Math.round((safeSize / (1024 * 1024)) * 10) / 10 + " MB";
  }

  if (safeSize >= 1024) {
    return Math.round(safeSize / 1024) + " KB";
  }

  return safeSize + " B";
}

function escapeClassName(value) {
  return String(value || "pending").replace(/[^a-zA-Z0-9_-]/g, "-");
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
