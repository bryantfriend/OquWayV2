import { courseEditorService } from "../services/courseEditorService.js?v=1.1.231-platform-performance-release";
import { courseEditorStore } from "../state/courseEditorState.js?v=1.1.231-platform-performance-release";
import {
  buildChatGPTCourseImportPrompt,
  createCourseImportExample,
  normalizeCourseImportDefinition,
  parseCourseImportText
} from "../../../../../packages/core/src/shared/courseImport/courseImport.js?v=1.1.231-platform-performance-release";

export function attachCourseImportEvents(courseId) {
  var openButton = document.getElementById("importCourseContentBtn");
  var modal = document.getElementById("courseImportModal");
  var textarea = document.getElementById("courseImportTextarea");
  var fileInput = document.getElementById("courseImportFileInput");
  var validateButton = document.getElementById("courseImportValidateBtn");
  var importButton = document.getElementById("courseImportConfirmBtn");
  var closeButtons = document.querySelectorAll("[data-close-course-import]");
  var preview = null;
  var importInProgress = false;

  if (!openButton || !modal || !textarea || !validateButton || !importButton) {
    return;
  }

  openButton.addEventListener("click", function () {
    preview = null;
    importInProgress = false;
    resetImportResult();
    modal.classList.remove("hidden");
    textarea.focus();
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!importInProgress) {
        modal.classList.add("hidden");
      }
    });
  });

  document.getElementById("courseImportCopyPromptBtn").addEventListener("click", async function () {
    var button = this;
    var course = courseEditorStore.getState().course || {};
    var prompt = buildChatGPTCourseImportPrompt({
      title: readText(course.title),
      subject: course.subject || "",
      level: course.level || course.grade || ""
    });

    try {
      await navigator.clipboard.writeText(prompt);
      button.innerHTML = '<i class="fa-solid fa-check"></i> Prompt copied';
      setTimeout(function () {
        button.innerHTML = '<i class="fa-regular fa-copy"></i> Copy ChatGPT prompt';
      }, 1800);
    } catch (error) {
      showImportStatus("error", "Could not copy automatically. Your browser may need clipboard permission.");
    }
  });

  document.getElementById("courseImportExampleBtn").addEventListener("click", function () {
    textarea.value = JSON.stringify(createCourseImportExample(), null, 2);
    preview = null;
    resetImportResult();
    textarea.focus();
  });

  textarea.addEventListener("input", function () {
    preview = null;
    importButton.disabled = true;
    importButton.classList.add("opacity-50", "cursor-not-allowed");
    importButton.textContent = "Validate first";
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    if (!file) {
      return;
    }

    if (file.size > 1000000) {
      showImportStatus("error", "Choose a JSON file smaller than 1 MB.");
      fileInput.value = "";
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      textarea.value = String(reader.result || "");
      preview = null;
      resetImportResult();
      validateImport();
    };
    reader.onerror = function () {
      showImportStatus("error", "The selected file could not be read.");
    };
    reader.readAsText(file);
  });

  validateButton.addEventListener("click", validateImport);

  importButton.addEventListener("click", async function () {
    if (!preview || importInProgress) {
      return;
    }

    importInProgress = true;
    setImportControlsDisabled(true);
    importButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Importing atomically...';
    showImportStatus("loading", "Creating modules, modes, sessions, learning content, and steps...");

    try {
      var applyMetadata = document.getElementById("courseImportApplyMetadata").checked;
      var result = await courseEditorService.importCourseContent(courseId, preview, applyMetadata);
      var data = result.emitted.data || {};
      showImportStatus(
        "success",
        "Imported " + data.importedModuleCount + " module" + (data.importedModuleCount === 1 ? "" : "s")
          + " and " + data.importedStepCount + " step" + (data.importedStepCount === 1 ? "" : "s") + "."
      );
      showCoursePageSuccess(data.importedModuleCount, data.importedStepCount);
      setTimeout(function () {
        modal.classList.add("hidden");
      }, 1100);
    } catch (error) {
      showImportStatus("error", error.message);
    } finally {
      importInProgress = false;
      setImportControlsDisabled(false);
      updateImportButton(preview);
    }
  });

  function validateImport() {
    var resultArea = document.getElementById("courseImportResult");

    try {
      var parsed = parseCourseImportText(textarea.value);
      var normalized = normalizeCourseImportDefinition(parsed);

      if (!normalized.valid) {
        preview = null;
        resultArea.innerHTML = buildIssueList(normalized.errors, "Fix these items", "red");
        showImportStatus("error", normalized.errors.length + " validation issue" + (normalized.errors.length === 1 ? "" : "s") + " found.");
        updateImportButton(null);
        return;
      }

      preview = normalized.data;
      resultArea.innerHTML = buildImportPreview(preview);
      showImportStatus(
        "success",
        "Valid import: " + preview.counts.modules + " module" + (preview.counts.modules === 1 ? "" : "s")
          + ", " + preview.counts.modes + " learning mode" + (preview.counts.modes === 1 ? "" : "s")
          + ", " + preview.counts.steps + " step" + (preview.counts.steps === 1 ? "" : "s") + "."
      );
      updateImportButton(preview);
    } catch (error) {
      preview = null;
      resultArea.innerHTML = buildIssueList([{ message: error.message }], "JSON could not be read", "red");
      showImportStatus("error", error.message);
      updateImportButton(null);
    }
  }
}

export function buildCourseImportModal() {
  return `
    <div id="courseImportModal" class="fixed inset-0 hidden z-50 overflow-y-auto bg-slate-950/75 p-4 lg:p-8">
      <div class="mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-5 border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-blue-50 px-6 py-5">
          <div class="flex items-center gap-4">
            <img src="./src/assets/learning-content-import.svg" alt="" class="h-16 w-16 rounded-2xl bg-white object-contain shadow-sm ring-1 ring-violet-100">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">ChatGPT course import</p>
              <h2 class="text-2xl font-black text-slate-950">Paste JSON. Create the complete module.</h2>
              <p class="mt-1 text-sm font-semibold text-slate-500">Import one module or a whole course with editable learning modes and steps.</p>
            </div>
          </div>
          <button type="button" data-close-course-import class="h-10 w-10 shrink-0 rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <section class="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <div class="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-black text-violet-900">1. Ask ChatGPT for import-ready JSON</p>
                  <p class="mt-1 text-xs font-semibold text-violet-700">The prompt contains the supported schema and activity types.</p>
                </div>
                <button id="courseImportCopyPromptBtn" type="button" class="rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-violet-700">
                  <i class="fa-regular fa-copy"></i> Copy ChatGPT prompt
                </button>
              </div>
            </div>

            <div class="mt-5 flex items-end justify-between gap-4">
              <div>
                <label for="courseImportTextarea" class="block text-xs font-black uppercase tracking-wide text-slate-600">2. Paste ChatGPT JSON</label>
                <p class="mt-1 text-xs font-semibold text-slate-400">JSON, a fenced JSON block, or a JavaScript variable containing JSON all work.</p>
              </div>
              <button id="courseImportExampleBtn" type="button" class="shrink-0 text-xs font-black text-violet-600 hover:text-violet-800">Load example</button>
            </div>
            <textarea id="courseImportTextarea" spellcheck="false" class="mt-3 min-h-[390px] w-full rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-200 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder='Paste {"schemaVersion":1,"modules":[...]} here'></textarea>

            <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label class="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">
                <i class="fa-solid fa-file-arrow-up"></i> Choose .json file
                <input id="courseImportFileInput" type="file" accept=".json,application/json,text/plain" class="hidden">
              </label>
              <button id="courseImportValidateBtn" type="button" class="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-black text-white hover:bg-black">
                <i class="fa-solid fa-shield-halved"></i> Validate and preview
              </button>
            </div>
          </section>

          <section class="flex min-h-[520px] flex-col bg-slate-50 p-6">
            <div>
              <p class="text-xs font-black uppercase tracking-wide text-slate-500">3. Review before import</p>
              <p class="mt-1 text-xs font-semibold text-slate-400">Nothing is written until validation succeeds and you confirm.</p>
            </div>

            <div id="courseImportResult" class="mt-4 flex-1">
              <div class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <i class="fa-solid fa-code text-3xl text-violet-300"></i>
                <h3 class="mt-3 text-base font-black text-slate-900">Waiting for course JSON</h3>
                <p class="mt-1 text-xs font-semibold text-slate-500">You will see every module, mode, and step count here.</p>
              </div>
            </div>

            <label class="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-blue-900">
              <input id="courseImportApplyMetadata" type="checkbox" checked class="mt-0.5 h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500">
              <span>Apply imported course title, description, subject, level, language, and tags to this course.</span>
            </label>
            <div id="courseImportStatus" class="mt-4 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-500 ring-1 ring-slate-200">Paste JSON, then validate it.</div>
          </section>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button type="button" data-close-course-import class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
          <button id="courseImportConfirmBtn" type="button" disabled class="cursor-not-allowed rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-black text-white opacity-50 shadow-sm hover:bg-violet-700">Validate first</button>
        </div>
      </div>
    </div>
  `;
}

function buildImportPreview(importData) {
  var metadata = importData.course || {};
  var html = "";

  if (metadata.title) {
    html += '<div class="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">'
      + '<p class="text-[10px] font-black uppercase tracking-wide text-blue-600">Course details</p>'
      + '<h3 class="mt-1 text-base font-black text-slate-950">' + escapeHtml(metadata.title) + '</h3>'
      + '<p class="mt-1 text-xs font-semibold text-slate-600">' + escapeHtml(metadata.subject || "No subject") + ' · ' + escapeHtml(metadata.level || "No level") + '</p>'
      + '</div>';
  }

  html += '<div class="space-y-3">';
  importData.modules.forEach(function (module, moduleIndex) {
    var stepCount = module.learningModes.reduce(function (count, mode) {
      return count + mode.steps.length;
    }, 0);
    html += '<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">'
      + '<div class="flex items-start justify-between gap-3">'
      + '<div><p class="text-[10px] font-black uppercase tracking-wide text-violet-500">Module ' + (moduleIndex + 1) + '</p>'
      + '<h4 class="mt-1 text-sm font-black text-slate-950">' + escapeHtml(module.title) + '</h4></div>'
      + '<span class="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700">' + stepCount + ' steps</span>'
      + '</div><div class="mt-3 flex flex-wrap gap-2">';
    module.learningModes.forEach(function (mode) {
      html += '<span class="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">'
        + escapeHtml(mode.title) + ' · ' + mode.steps.length + '</span>';
    });
    html += '</div></div>';
  });
  html += '</div>';

  if (importData.warnings && importData.warnings.length > 0) {
    html += buildIssueList(importData.warnings, "Automatic adjustments", "amber");
  }

  return html;
}

function buildIssueList(issues, title, color) {
  var safeIssues = Array.isArray(issues) ? issues : [];
  var colorClasses = color === "red"
    ? "border-red-100 bg-red-50 text-red-800"
    : "border-amber-100 bg-amber-50 text-amber-800";

  return '<div class="mt-4 rounded-2xl border p-4 ' + colorClasses + '">'
    + '<p class="text-xs font-black">' + escapeHtml(title) + '</p>'
    + '<ul class="mt-2 list-disc space-y-1 pl-4 text-xs font-semibold">'
    + safeIssues.map(function (issue) {
      return '<li>' + escapeHtml(issue.message || "Review this item.") + '</li>';
    }).join("")
    + '</ul></div>';
}

function updateImportButton(preview) {
  var button = document.getElementById("courseImportConfirmBtn");
  var isValid = Boolean(preview);

  button.disabled = !isValid;
  button.classList.toggle("opacity-50", !isValid);
  button.classList.toggle("cursor-not-allowed", !isValid);
  button.innerHTML = isValid
    ? '<i class="fa-solid fa-wand-magic-sparkles"></i> Import ' + preview.counts.modules + ' module' + (preview.counts.modules === 1 ? '' : 's')
    : "Validate first";
}

function setImportControlsDisabled(disabled) {
  [
    "courseImportTextarea",
    "courseImportFileInput",
    "courseImportValidateBtn",
    "courseImportCopyPromptBtn",
    "courseImportExampleBtn",
    "courseImportApplyMetadata"
  ].forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.disabled = disabled;
    }
  });
}

function resetImportResult() {
  document.getElementById("courseImportResult").innerHTML = '<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">'
    + '<i class="fa-solid fa-code text-3xl text-violet-300"></i>'
    + '<h3 class="mt-3 text-base font-black text-slate-900">Waiting for course JSON</h3>'
    + '<p class="mt-1 text-xs font-semibold text-slate-500">You will see every module, mode, and step count here.</p></div>';
  showImportStatus("idle", "Paste JSON, then validate it.");
  updateImportButton(null);
}

function showImportStatus(type, message) {
  var element = document.getElementById("courseImportStatus");
  var classes = {
    idle: "bg-white text-slate-500 ring-slate-200",
    loading: "bg-blue-50 text-blue-700 ring-blue-100",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    error: "bg-red-50 text-red-700 ring-red-100"
  };
  element.className = "mt-4 rounded-xl px-4 py-3 text-xs font-bold ring-1 " + (classes[type] || classes.idle);
  element.textContent = message;
}

function showCoursePageSuccess(moduleCount, stepCount) {
  var element = document.getElementById("moduleCreateStatusMsg");
  if (!element) {
    return;
  }
  element.style.display = "inline-flex";
  element.className = "text-sm font-bold text-emerald-700";
  element.textContent = "Imported " + moduleCount + " module" + (moduleCount === 1 ? "" : "s") + " · " + stepCount + " steps";
  setTimeout(function () {
    element.style.display = "none";
  }, 3500);
}

function readText(value) {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object") {
    return value.en || value.ru || value.ky || "";
  }
  return "";
}

function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
