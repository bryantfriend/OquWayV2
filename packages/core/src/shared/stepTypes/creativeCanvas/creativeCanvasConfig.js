import {
  CREATIVE_CANVAS_DEFAULT_PRESET,
  readCreativeCanvasPreset
} from "./creativeCanvasPresets.js?v=1.1.192-timed-sequence";
import { normalizeToolList } from "./creativeCanvasTools.js?v=1.1.192-timed-sequence";

export function normalizeCreativeCanvasConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectPreset = readSubjectPreset(safeConfig.subjectPreset);
  var preset = readCreativeCanvasPreset(subjectPreset);
  var activityTemplate = readTemplate(safeConfig.activityTemplate || safeConfig._activityTemplate);
  var settings = normalizeSettings(safeConfig, activityTemplate);
  var requiredTools = normalizeToolList(safeConfig.requiredTools, settings);
  var stampPack = readString(safeConfig.stampPack, preset.stampPack);

  return {
    stepType: "creative-canvas",
    activityTemplate: activityTemplate,
    title: readString(safeConfig.title, "Create Your ICT World"),
    prompt: readString(safeConfig.prompt, preset.prompt),
    instructions: readString(safeConfig.instructions, "Use the canvas tools to create a visual response."),
    subjectPreset: subjectPreset,
    subjectPresetName: preset.name,
    canvasBackground: readCanvasBackground(safeConfig.canvasBackground, preset.canvasBackground, activityTemplate),
    requiredTools: requiredTools,
    stampPack: stampPack,
    stamps: readStamps(stampPack, preset.stamps),
    completionRule: readCompletionRule(safeConfig.completionRule),
    minimumTimeSeconds: readPositiveNumber(safeConfig.minimumTimeSeconds, 20),
    settings: settings
  };
}

function readSubjectPreset(subjectPreset) {
  var safePreset = typeof subjectPreset === "string" ? subjectPreset.trim() : "";
  var preset = readCreativeCanvasPreset(safePreset);

  return preset.id || CREATIVE_CANVAS_DEFAULT_PRESET;
}

function readTemplate(template) {
  var safeTemplate = typeof template === "string" ? template.trim() : "";

  if (safeTemplate === "label-and-draw" || safeTemplate === "diagram-builder") {
    return safeTemplate;
  }

  return "free-draw-canvas";
}

function normalizeSettings(config, activityTemplate) {
  var rawSettings = config.settings && typeof config.settings === "object" && !Array.isArray(config.settings)
    ? config.settings
    : {};

  return {
    allowBrush: readBoolean(config.allowBrush, readBoolean(rawSettings.allowBrush, true)),
    allowSpray: readBoolean(config.allowSpray, readBoolean(rawSettings.allowSpray, true)),
    allowFill: readBoolean(config.allowFill, readBoolean(rawSettings.allowFill, true)),
    allowStamps: readBoolean(config.allowStamps, readBoolean(rawSettings.allowStamps, true)),
    allowLabels: activityTemplate === "label-and-draw" ? true : readBoolean(config.allowLabels, readBoolean(rawSettings.allowLabels, false)),
    allowUndo: readBoolean(config.allowUndo, readBoolean(rawSettings.allowUndo, true)),
    allowClear: readBoolean(config.allowClear, readBoolean(rawSettings.allowClear, true))
  };
}

function readCanvasBackground(value, presetBackground, template) {
  var background = readString(value, presetBackground);

  if (template === "diagram-builder" && !value) {
    return "grid-light";
  }

  if (background === "blank-light" || background === "blank-dark" || background === "grid-light" || background === "paper") {
    return background;
  }

  return "blank-dark";
}

function readCompletionRule(value) {
  var rule = readString(value, "submit-canvas");

  if (rule === "minimum-time" || rule === "teacher-review") {
    return rule;
  }

  return "submit-canvas";
}

function readStamps(stampPack, fallbackStamps) {
  var preset = readCreativeCanvasPreset(readPresetForStampPack(stampPack));

  if (preset && preset.stamps.length > 0) {
    return preset.stamps;
  }

  return fallbackStamps;
}

function readPresetForStampPack(stampPack) {
  if (stampPack === "science") {
    return "science-diagram";
  }
  if (stampPack === "math") {
    return "math-sketch";
  }
  if (stampPack === "english") {
    return "english-storyboard";
  }
  if (stampPack === "history") {
    return "history-artifact";
  }
  return "ict-design";
}

function readString(value, fallbackValue) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return fallbackValue;
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

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallbackValue;
  }

  return Math.round(number);
}
