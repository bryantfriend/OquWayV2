import {
  getLearningActivityDefinition,
  listLearningActivityDefinitions
} from "../../../../../packages/domain/learningActivities/index.js?v=1.1.228-learning-activity-drag-interactions";
import { PracticeModePlayer } from "../../../../../packages/shared/player/index.js?v=1.1.228-learning-activity-drag-interactions";
import { COURSE_CREATOR_VERSION } from "../../version.js?v=1.1.228-learning-activity-drag-interactions";

export class ActivityStudioPage {
  constructor(options) {
    var safeOptions = options && typeof options === "object" ? options : {};
    var activities = listLearningActivityDefinitions();
    var firstActivity = activities.length > 0 ? activities[0] : null;

    this.activities = activities;
    this.selectedActivityType = safeOptions.activityType || (firstActivity ? firstActivity.activityType : "");
    this.selectedTemplateId = safeOptions.templateId || "";
    this.activeTab = safeOptions.tab || "overview";
    this.eventLog = [];
    this.player = null;
  }

  render() {
    return '<div id="activity-studio-page" class="min-h-screen bg-slate-100">'
      + this.buildPageHtml()
      + '</div>';
  }

  attachEvents() {
    var root = document.getElementById("activity-studio-page");
    var self = this;

    if (!root) {
      return;
    }

    root.addEventListener("click", function (event) {
      self.handleClick(event);
    });

    this.ensureSelectedTemplate();
    this.mountPreviewIfNeeded();
  }

  handleClick(event) {
    var tabButton = event.target.closest("[data-studio-tab]");
    var activityButton = event.target.closest("[data-activity-type]");
    var templateButton = event.target.closest("[data-template-id]");
    var previewButton = event.target.closest("[data-preview-template-id]");

    if (tabButton) {
      this.activeTab = tabButton.getAttribute("data-studio-tab") || "overview";
      this.refresh();
      return;
    }

    if (activityButton) {
      this.selectedActivityType = activityButton.getAttribute("data-activity-type") || "";
      this.selectedTemplateId = "";
      this.activeTab = "overview";
      this.eventLog = [];
      this.refresh();
      return;
    }

    if (templateButton) {
      this.selectedTemplateId = templateButton.getAttribute("data-template-id") || "";
      this.activeTab = "templates";
      this.refresh();
      return;
    }

    if (previewButton) {
      this.selectedTemplateId = previewButton.getAttribute("data-preview-template-id") || "";
      this.activeTab = "preview";
      this.eventLog = [];
      this.refresh();
    }
  }

  refresh() {
    var root = document.getElementById("activity-studio-page");

    this.destroyPlayer();

    if (!root) {
      return;
    }

    this.ensureSelectedTemplate();
    root.innerHTML = this.buildPageHtml();
    this.mountPreviewIfNeeded();
  }

  ensureSelectedTemplate() {
    var activity = this.readSelectedActivity();
    var templates = readTemplates(activity);

    if (this.selectedTemplateId && findTemplate(templates, this.selectedTemplateId)) {
      return;
    }

    if (activity && this.selectedTemplateId) {
      console.warn("[activity-studio] Explicit template fallback", {
        activityType: activity.activityType,
        requestedTemplateId: this.selectedTemplateId,
        fallbackTemplateId: activity.defaultTemplate || ""
      });
    }

    this.selectedTemplateId = activity && templates.length > 0 ? activity.defaultTemplate || templates[0].meta.templateId : "";
  }

  mountPreviewIfNeeded() {
    var target = document.getElementById("activity-studio-preview-root");
    var activity = this.readSelectedActivity();
    var template = this.readSelectedTemplate();
    var config = null;
    var self = this;

    if (!target || !activity || !template) {
      return;
    }

    config = readTemplatePreviewContent(activity, template);
    config.templateId = template.meta.templateId;

    this.player = new PracticeModePlayer({
      courseId: "activity-studio",
      moduleId: "activity-studio",
      sessionId: "activity-studio",
      practiceModeKey: "activity-studio",
      practiceMode: {
        key: "activity-studio",
        title: { en: "Activity Studio Preview", ru: "", ky: "" },
        steps: []
      },
      steps: [
        {
          id: "activity-studio-" + activity.activityType + "-" + template.meta.templateId,
          type: activity.activityType,
          title: { en: template.meta.displayName, ru: "", ky: "" },
          order: 1,
          config: config
        }
      ],
      actor: {
        id: "activity-studio-preview",
        role: "courseCreator"
      },
      mode: "student",
      backLabel: "Studio",
      onBack: function () {
        self.activeTab = "overview";
        self.refresh();
      },
      onActivityInteraction: function (step, interaction) {
        self.recordEvent(interaction);
      },
      onStepComplete: function (step, completionResult) {
        self.recordEvent({
          type: "activity_completed",
          activityType: activity.activityType,
          templateId: template.meta.templateId,
          score: completionResult && typeof completionResult.score === "number" ? completionResult.score : null
        });
      }
    });

    this.player.mount(target);
  }

  recordEvent(event) {
    this.eventLog.unshift(Object.assign({
      createdAt: new Date().toISOString()
    }, event || {}));

    if (this.eventLog.length > 12) {
      this.eventLog = this.eventLog.slice(0, 12);
    }

    this.renderDiagnostics();
  }

  renderDiagnostics() {
    var target = document.getElementById("activity-studio-event-log");

    if (!target) {
      return;
    }

    target.innerHTML = this.buildEventLogHtml();
  }

  buildPageHtml() {
    var activity = this.readSelectedActivity();

    return '<nav class="builder-nav">'
      + '<div class="builder-brand"><span>OquWay</span><small>Activity Studio v' + escapeHtml(COURSE_CREATOR_VERSION) + '</small></div>'
      + '<div class="builder-nav-actions">'
      + '<a href="#" class="builder-btn builder-btn-ghost"><i class="fa-solid fa-table-cells-large"></i> Courses</a>'
      + '</div>'
      + '</nav>'
      + '<main class="builder-main">'
      + '<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">'
      + '<div class="flex flex-wrap items-start justify-between gap-4">'
      + '<div><p class="builder-eyebrow">Developer Tools</p><h1 class="mt-1 text-3xl font-black text-slate-950">Learning Activity Studio</h1></div>'
      + '<div class="flex flex-wrap gap-2">' + this.buildActivityButtonsHtml() + '</div>'
      + '</div>'
      + '</section>'
      + (activity ? this.buildStudioHtml(activity) : this.buildInvalidActivityHtml())
      + '</main>';
  }

  buildStudioHtml(activity) {
    return '<section class="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">'
      + '<div class="border-b border-slate-100 p-4">'
      + '<div class="flex flex-wrap items-center gap-2">' + this.buildTabsHtml() + '</div>'
      + '</div>'
      + '<div class="p-5">' + this.buildActiveTabHtml(activity) + '</div>'
      + '</section>';
  }

  buildActiveTabHtml(activity) {
    if (this.activeTab === "base") {
      return this.buildBaseActivityHtml(activity);
    }

    if (this.activeTab === "templates") {
      return this.buildTemplatesHtml(activity);
    }

    if (this.activeTab === "schema") {
      return this.buildSchemaHtml(activity);
    }

    if (this.activeTab === "preview") {
      return this.buildPreviewHtml(activity);
    }

    if (this.activeTab === "diagnostics") {
      return this.buildDiagnosticsHtml(activity);
    }

    return this.buildOverviewHtml(activity);
  }

  buildOverviewHtml(activity) {
    var templates = readTemplates(activity);

    return '<div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + '<div class="text-xs font-black uppercase text-slate-400">Activity Type</div>'
      + '<h2 class="mt-2 text-2xl font-black text-slate-950">' + escapeHtml(activity.displayName) + '</h2>'
      + '<p class="mt-2 text-sm font-semibold leading-6 text-slate-600">' + escapeHtml(activity.description || "") + '</p>'
      + '<dl class="mt-4 grid gap-2 text-sm">'
      + buildDefinitionRow("activityType", activity.activityType)
      + buildDefinitionRow("defaultTemplate", activity.defaultTemplate || "")
      + buildDefinitionRow("previewHandler", activity.previewHandler && activity.previewHandler.type ? activity.previewHandler.type : "")
      + '</dl>'
      + '</div>'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + '<div class="text-xs font-black uppercase text-slate-400">Templates</div>'
      + '<div class="mt-3 grid gap-2">' + (templates.length > 0 ? templates.map(buildTemplateButtonHtml).join("") : buildEmptyNotice("No templates registered.")) + '</div>'
      + '</div>'
      + '</div>';
  }

  buildBaseActivityHtml(activity) {
    return '<div class="grid gap-3">'
      + Object.keys(activity.baseFiles || {}).map(function (key) {
        return '<div class="rounded-xl border border-slate-100 bg-slate-50 p-3">'
          + '<div class="text-[10px] font-black uppercase text-slate-400">' + escapeHtml(key) + '</div>'
          + '<code class="mt-1 block break-all text-xs font-bold text-slate-700">' + escapeHtml(activity.baseFiles[key]) + '</code>'
          + '</div>';
      }).join("")
      + '</div>';
  }

  buildTemplatesHtml(activity) {
    var templates = readTemplates(activity);
    var selected = this.readSelectedTemplate();

    if (templates.length === 0) {
      return buildEmptyNotice("No templates registered for this activity.");
    }

    return '<div class="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">'
      + '<div class="grid content-start gap-2">' + templates.map(buildTemplateButtonHtml).join("") + '</div>'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + (selected ? buildTemplateMetadataHtml(selected) : buildEmptyNotice("Template metadata is unavailable."))
      + '</div>'
      + '</div>';
  }

  buildSchemaHtml(activity) {
    return '<pre class="max-h-[560px] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">'
      + escapeHtml(JSON.stringify(activity.schema || {}, null, 2))
      + '</pre>';
  }

  buildPreviewHtml(activity) {
    var templates = readTemplates(activity);
    var selected = this.readSelectedTemplate();

    if (templates.length === 0) {
      return buildEmptyNotice("Preview unavailable because no templates are registered.");
    }

    if (!selected) {
      return buildEmptyNotice("Preview unavailable because the selected template is invalid.");
    }

    return '<div class="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">'
      + '<div class="grid content-start gap-2">' + templates.map(buildPreviewButtonHtml).join("") + '</div>'
      + '<div class="grid gap-3">'
      + '<div class="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-black text-slate-500">Selected template: <span class="text-slate-900">' + escapeHtml(selected.meta.displayName) + '</span></div>'
      + '<div id="activity-studio-preview-root" class="min-h-[620px] overflow-hidden rounded-xl border border-slate-200 bg-white"></div>'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + '<div class="text-xs font-black uppercase text-slate-400">Preview Events</div>'
      + '<div id="activity-studio-event-log" class="mt-3">' + this.buildEventLogHtml() + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  buildDiagnosticsHtml(activity) {
    var templates = readTemplates(activity);

    return '<div class="grid gap-4 lg:grid-cols-2">'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + '<div class="text-xs font-black uppercase text-slate-400">Registry Health</div>'
      + '<div class="mt-3 grid gap-2 text-sm font-bold text-slate-700">'
      + buildDiagnosticLine("Activity registered", Boolean(activity))
      + buildDiagnosticLine("Templates registered", templates.length > 0)
      + buildDiagnosticLine("Default template valid", Boolean(findTemplate(templates, activity.defaultTemplate)))
      + buildDiagnosticLine("Schema available", Boolean(activity.schema))
      + '</div>'
      + '</div>'
      + '<div class="rounded-xl border border-slate-100 p-4">'
      + '<div class="text-xs font-black uppercase text-slate-400">Event Log</div>'
      + '<div id="activity-studio-event-log" class="mt-3">' + this.buildEventLogHtml() + '</div>'
      + '</div>'
      + '</div>';
  }

  buildEventLogHtml() {
    if (this.eventLog.length === 0) {
      return '<div class="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">No preview events yet.</div>';
    }

    return this.eventLog.map(function (event) {
      return '<pre class="mb-2 overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">'
        + escapeHtml(JSON.stringify(event, null, 2))
        + '</pre>';
    }).join("");
  }

  buildActivityButtonsHtml() {
    if (this.activities.length === 0) {
      return '<span class="text-xs font-black text-slate-400">No activities</span>';
    }

    return this.activities.map(function (activity) {
      var active = activity.activityType === this.selectedActivityType ? " bg-slate-950 text-white" : " bg-white text-slate-700";
      return '<button type="button" class="rounded-full border border-slate-200 px-3 py-2 text-xs font-black' + active + '" data-activity-type="' + escapeHtml(activity.activityType) + '">' + escapeHtml(activity.displayName) + '</button>';
    }, this).join("");
  }

  buildTabsHtml() {
    var tabs = [
      ["overview", "Overview"],
      ["base", "Base Activity"],
      ["templates", "Templates"],
      ["schema", "Schema"],
      ["preview", "Preview"],
      ["diagnostics", "Diagnostics"]
    ];

    return tabs.map(function (tab) {
      var active = tab[0] === this.activeTab ? " oqu-editor-tab-active" : "";
      return '<button type="button" class="editor-tab-btn' + active + '" data-studio-tab="' + tab[0] + '">' + escapeHtml(tab[1]) + '</button>';
    }, this).join("");
  }

  buildInvalidActivityHtml() {
    return '<section class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">'
      + '<h2 class="text-xl font-black">Invalid activity type</h2>'
      + '<p class="mt-2 text-sm font-bold">The requested activity is not registered: ' + escapeHtml(this.selectedActivityType || "missing") + '</p>'
      + '</section>';
  }

  readSelectedActivity() {
    return getLearningActivityDefinition(this.selectedActivityType);
  }

  readSelectedTemplate() {
    return findTemplate(readTemplates(this.readSelectedActivity()), this.selectedTemplateId);
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

function readTemplates(activity) {
  if (!activity || !Array.isArray(activity.templates)) {
    return [];
  }

  return activity.templates;
}

function findTemplate(templates, templateId) {
  var index = 0;

  while (index < templates.length) {
    if (templates[index].meta && templates[index].meta.templateId === templateId) {
      return templates[index];
    }

    index = index + 1;
  }

  return null;
}

function readTemplatePreviewContent(activity, template) {
  if (template && template.module && typeof template.module.getTemplatePreviewContent === "function") {
    return template.module.getTemplatePreviewContent();
  }

  console.warn("[activity-studio] Template preview content missing", {
    activityType: activity && activity.activityType ? activity.activityType : "",
    templateId: template && template.meta ? template.meta.templateId : ""
  });

  if (template && template.module && typeof template.module.getTemplateDefaultContent === "function") {
    return template.module.getTemplateDefaultContent();
  }

  return {
    title: "Preview unavailable",
    instructions: "Template preview content is missing.",
    cards: []
  };
}

function buildTemplateButtonHtml(template) {
  var meta = template.meta || {};

  return '<button type="button" class="rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-sky-300 hover:bg-sky-50" data-template-id="' + escapeHtml(meta.templateId || "") + '">'
    + '<div class="text-sm font-black text-slate-900">' + escapeHtml(meta.displayName || "Missing display name") + '</div>'
    + '<div class="mt-1 text-xs font-bold text-slate-500">' + escapeHtml(meta.templateId || "missing-template-id") + '</div>'
    + '</button>';
}

function buildPreviewButtonHtml(template) {
  var meta = template.meta || {};

  return '<button type="button" class="rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-emerald-300 hover:bg-emerald-50" data-preview-template-id="' + escapeHtml(meta.templateId || "") + '">'
    + '<div class="text-sm font-black text-slate-900">' + escapeHtml(meta.displayName || "Missing display name") + '</div>'
    + '<div class="mt-1 text-xs font-bold text-emerald-600">Launch preview</div>'
    + '</button>';
}

function buildTemplateMetadataHtml(template) {
  var meta = template.meta || {};
  var warnings = validateTemplateMeta(meta);

  return '<div class="grid gap-4">'
    + '<div><div class="text-xs font-black uppercase text-slate-400">Template Metadata</div><h2 class="mt-2 text-xl font-black text-slate-950">' + escapeHtml(meta.displayName || "Missing display name") + '</h2></div>'
    + '<dl class="grid gap-2 text-sm">'
    + buildDefinitionRow("templateId", meta.templateId || "")
    + buildDefinitionRow("activityType", meta.activityType || "")
    + buildDefinitionRow("description", meta.description || "")
    + buildDefinitionRow("supportsPreview", String(meta.supportsPreview === true))
    + buildDefinitionRow("supportsStudentMode", String(meta.supportsStudentMode === true))
    + buildDefinitionRow("supportsTeacherPreview", String(meta.supportsTeacherPreview === true))
    + buildDefinitionRow("requiredContentFields", (meta.requiredContentFields || []).join(", "))
    + buildDefinitionRow("visualFeatures", (meta.visualFeatures || []).join(", "))
    + '</dl>'
    + '<div class="rounded-xl border border-slate-100 bg-slate-50 p-3"><div class="text-xs font-black uppercase text-slate-400">Files</div>' + buildFilesHtml(meta.files || {}) + '</div>'
    + (warnings.length > 0 ? '<div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-black text-amber-800">' + escapeHtml(warnings.join(" ")) + '</div>' : "")
    + '</div>';
}

function buildFilesHtml(files) {
  return Object.keys(files).map(function (key) {
    return '<code class="mt-2 block break-all text-xs font-bold text-slate-700">' + escapeHtml(key + ": " + files[key]) + '</code>';
  }).join("");
}

function validateTemplateMeta(meta) {
  var warnings = [];
  var requiredKeys = [
    "templateId",
    "activityType",
    "displayName",
    "description",
    "supportsPreview",
    "supportsStudentMode",
    "supportsTeacherPreview",
    "requiredContentFields",
    "visualFeatures"
  ];

  requiredKeys.forEach(function (key) {
    if (meta[key] === undefined || meta[key] === null || meta[key] === "") {
      warnings.push("Missing metadata field: " + key + ".");
    }
  });

  return warnings;
}

function buildDefinitionRow(label, value) {
  return '<div class="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[180px_minmax(0,1fr)]">'
    + '<dt class="text-xs font-black uppercase text-slate-400">' + escapeHtml(label) + '</dt>'
    + '<dd class="break-words text-sm font-bold text-slate-700">' + escapeHtml(value) + '</dd>'
    + '</div>';
}

function buildDiagnosticLine(label, passed) {
  return '<div class="flex items-center justify-between rounded-lg bg-slate-50 p-3">'
    + '<span>' + escapeHtml(label) + '</span>'
    + '<strong class="' + (passed ? "text-emerald-600" : "text-rose-600") + '">' + (passed ? "OK" : "Check") + '</strong>'
    + '</div>';
}

function buildEmptyNotice(message) {
  return '<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-500">' + escapeHtml(message) + '</div>';
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
