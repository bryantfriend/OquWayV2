import {
  TUNING_CHALLENGE_DEFAULT_THEME,
  readTuningChallengePreset
} from "./tuningChallengePresets.js?v=1.1.192-timed-sequence";
import { createControlValues } from "./syncCalculationUtils.js?v=1.1.192-timed-sequence";

export var TUNING_CHALLENGE_TEMPLATE_ID = "tuning-challenge";

var supportedTargetTypes = {
  wave: true,
  graph: true,
  signal: true,
  color: true
};

var supportedRules = {
  "sync-threshold": true,
  "sync-hold": true,
  "time-limit": true
};

export function normalizeTuningChallengeConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readTuningChallengePreset(subjectTheme);
  var controls = normalizeControls(safeConfig.controls, safeConfig.controlLabels, preset.controls);
  var targetType = readTargetType(safeConfig.targetType, preset.targetType);
  var targetValues = createControlValues(controls, Object.assign({}, preset.targetValues, parseTargetValues(safeConfig.targetValuesText), safeConfig.targetValues));

  return {
    stepType: "practice-challenge",
    activityTemplate: TUNING_CHALLENGE_TEMPLATE_ID,
    title: readString(safeConfig.title, preset.title || "Tuning Challenge"),
    instructions: readString(safeConfig.instructions, preset.instructions || "Adjust the controls until your pattern matches the target."),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    targetType: targetType,
    variation: targetType === "wave" ? "wave-tuner" : targetType + "-match",
    completionRule: readCompletionRule(safeConfig.completionRule),
    syncThreshold: readPositiveNumber(safeConfig.syncThreshold, 90),
    holdSeconds: readPositiveNumber(safeConfig.holdSeconds, 5),
    timeLimitSeconds: readPositiveNumber(safeConfig.timeLimitSeconds, 120),
    difficulty: readString(safeConfig.difficulty, "medium"),
    controls: controls,
    targetValues: targetValues,
    settings: {
      targetDrift: readBoolean(safeConfig.targetDrift, readBoolean(safeConfig.settings && safeConfig.settings.targetDrift, false)),
      showGrid: readBoolean(safeConfig.showGrid, readBoolean(safeConfig.settings && safeConfig.settings.showGrid, true)),
      showTargetOverlay: readBoolean(safeConfig.showTargetOverlay, readBoolean(safeConfig.settings && safeConfig.settings.showTargetOverlay, true)),
      showScore: readBoolean(safeConfig.showScore, readBoolean(safeConfig.settings && safeConfig.settings.showScore, true))
    },
    valid: controls.length > 0
  };
}

function normalizeControls(arrayValue, labelsValue, presetControls) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeControl).filter(Boolean) : [];
  var fromLabels = parseControlLabels(labelsValue);
  var controls = fromArray.length > 0 ? fromArray : fromLabels;

  if (controls.length === 0) {
    controls = presetControls.map(function (control) {
      return Object.assign({}, control);
    });
  }

  return controls.slice(0, 4);
}

function parseControlLabels(value) {
  return splitLines(value).map(function (label, index) {
    var id = slugify(label || ("control-" + index));

    return normalizeControl({
      id: index === 0 ? "frequency" : index === 1 ? "amplitude" : id,
      label: label,
      min: 1,
      max: 10,
      step: 0.1,
      defaultValue: 5
    });
  }).filter(Boolean);
}

function normalizeControl(control) {
  var safeControl = control && typeof control === "object" ? control : {};
  var label = readString(safeControl.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safeControl.id, slugify(label)),
    label: label,
    min: readNumber(safeControl.min, 1),
    max: readNumber(safeControl.max, 10),
    step: readNumber(safeControl.step, 0.1),
    defaultValue: readNumber(safeControl.defaultValue, 5)
  };
}

function parseTargetValues(value) {
  var result = {};

  splitLines(value).forEach(function (line) {
    var parts = line.split("|");
    var key = slugify(parts[0] || "");
    var number = Number(parts[1]);

    if (key && Number.isFinite(number)) {
      result[key] = number;
    }
  });

  return result;
}

function readSupportedTheme(themeId) {
  var safeThemeId = typeof themeId === "string" ? themeId.trim() : "";
  var preset = readTuningChallengePreset(safeThemeId);

  return preset.id || TUNING_CHALLENGE_DEFAULT_THEME;
}

function readTargetType(value, fallbackValue) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedTargetTypes[safeValue] ? safeValue : fallbackValue || "wave";
}

function readCompletionRule(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedRules[safeValue] ? safeValue : "sync-hold";
}

function splitLines(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(Boolean);
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}

function readNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) ? Math.round(number * 100) / 100 : fallbackValue;
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : fallbackValue;
}

function readBoolean(value, fallbackValue) {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return fallbackValue;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "value";
}
