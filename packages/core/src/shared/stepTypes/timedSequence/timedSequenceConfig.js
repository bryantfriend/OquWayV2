import {
  TIMED_SEQUENCE_DEFAULT_THEME,
  createDefaultSequenceItemsText,
  readTimedSequenceTheme
} from "./timedSequencePresetLibrary.js?v=1.1.192-timed-sequence";

export var TIMED_SEQUENCE_DEFAULT_TEMPLATE = "defusal-sequence";

var supportedTemplates = {
  "defusal-sequence": true,
  "workflow-sequence": true,
  "code-execution-order": true,
  "emergency-response": true
};

var supportedRules = {
  "complete-levels": true,
  "survive-time": true,
  "reach-score": true
};

export function normalizeTimedSequenceConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSubjectTheme(safeConfig.subjectTheme);
  var preset = readTimedSequenceTheme(subjectTheme);
  var activityTemplate = readTemplate(safeConfig.activityTemplate || safeConfig._activityTemplate);
  var effectiveTemplate = activityTemplate === "code-execution-order" ? "workflow-sequence" : "defusal-sequence";
  var startingSequenceLength = readBoundedNumber(safeConfig.startingSequenceLength, 4, 1, 24);
  var maximumSequenceLength = readBoundedNumber(safeConfig.maximumSequenceLength, 8, startingSequenceLength, 32);
  var sequenceItems = normalizeSequenceItems(safeConfig.sequenceItems, safeConfig.sequenceItemsText, preset.items);

  if (activityTemplate === "workflow-sequence") {
    effectiveTemplate = "workflow-sequence";
  }

  return {
    stepType: "timed-sequence",
    activityTemplate: activityTemplate,
    effectiveTemplate: effectiveTemplate,
    title: readString(safeConfig.title, "Timed Sequence Challenge"),
    instructions: readString(safeConfig.instructions, "Complete the required sequence in order before time runs out."),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    startingTimeSeconds: readBoundedNumber(safeConfig.startingTimeSeconds, 10, 1, 180),
    minimumTimeSeconds: readBoundedNumber(safeConfig.minimumTimeSeconds, 3, 1, 180),
    startingSequenceLength: startingSequenceLength,
    maximumSequenceLength: maximumSequenceLength,
    difficultyIncrease: readBoolean(safeConfig.difficultyIncrease, true),
    glitchesEnabled: readBoolean(safeConfig.glitchesEnabled, true),
    completionRule: readCompletionRule(safeConfig.completionRule),
    requiredLevels: readBoundedNumber(safeConfig.requiredLevels, 5, 1, 50),
    targetScore: readBoundedNumber(safeConfig.targetScore, 1200, 100, 999999),
    sequenceItems: sequenceItems,
    sequenceItemsText: typeof safeConfig.sequenceItemsText === "string" ? safeConfig.sequenceItemsText : createDefaultSequenceItemsText(),
    comingSoonTemplate: activityTemplate === "code-execution-order" || activityTemplate === "emergency-response" ? activityTemplate : "",
    valid: sequenceItems.length >= 2
  };
}

export function createDefaultTimedSequenceItemsText() {
  return createDefaultSequenceItemsText();
}

function normalizeSequenceItems(arrayValue, textValue, presetItems) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeItem).filter(Boolean) : [];
  var fromText = parseItemsText(textValue);
  var items = fromArray.length > 0 ? fromArray : fromText;

  if (items.length === 0) {
    items = presetItems.map(normalizeItem).filter(Boolean);
  }

  return items.map(function (item, index) {
    return {
      id: readString(item.id, slugify(item.label || "item-" + index)),
      label: readString(item.label, "Item " + (index + 1)),
      colorClass: readColorClass(item.colorClass, index)
    };
  });
}

function parseItemsText(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  return value.split(/\r?\n/).map(function (line, index) {
    var parts = line.split("|").map(function (part) {
      return part.trim();
    });

    if (!parts[0]) {
      return null;
    }

    return normalizeItem({
      id: slugify(parts[0]) || "item-" + index,
      label: parts[0],
      colorClass: parts[1] || ""
    });
  }).filter(Boolean);
}

function normalizeItem(item) {
  var safeItem = item && typeof item === "object" ? item : {};
  var label = readString(safeItem.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safeItem.id, slugify(label)),
    label: label,
    colorClass: readString(safeItem.colorClass, "")
  };
}

function readTemplate(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedTemplates[safeValue] ? safeValue : TIMED_SEQUENCE_DEFAULT_TEMPLATE;
}

function readSubjectTheme(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";
  var preset = readTimedSequenceTheme(safeValue);

  return preset.id || TIMED_SEQUENCE_DEFAULT_THEME;
}

function readCompletionRule(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedRules[safeValue] ? safeValue : "complete-levels";
}

function readColorClass(value, index) {
  var safeValue = readString(value, "");
  var fallback = ["red", "blue", "green", "yellow", "purple", "amber", "slate"];

  if (safeValue.indexOf("bg-") === 0) {
    safeValue = safeValue.replace(/^bg-/, "").replace(/-\d+$/, "");
  }

  return safeValue || fallback[index % fallback.length];
}

function readBoundedNumber(value, fallbackValue, min, max) {
  var number = Math.round(Number(value));

  if (!Number.isFinite(number)) {
    number = fallbackValue;
  }

  return Math.max(min, Math.min(max, number));
}

function readBoolean(value, fallbackValue) {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return fallbackValue === true;
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}

function slugify(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}
