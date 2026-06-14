import {
  SEQUENCE_MEMORY_DEFAULT_THEME,
  createDefaultPadsText,
  readSequenceMemoryTheme
} from "./sequencePresetLibrary.js?v=1.1.192-timed-sequence";

export var SEQUENCE_MEMORY_DEFAULT_TEMPLATE = "synth-sequence";

var supportedTemplates = {
  "synth-sequence": true,
  "pattern-repeat": true,
  "rhythm-builder": true,
  "algorithm-trace": true
};

var supportedRules = {
  "reach-max-sequence": true,
  "complete-levels": true,
  "practice-only": true
};

export function normalizeSequenceMemoryConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSubjectTheme(safeConfig.subjectTheme);
  var preset = readSequenceMemoryTheme(subjectTheme);
  var activityTemplate = readTemplate(safeConfig.activityTemplate || safeConfig._activityTemplate);
  var gridSize = readGridSize(safeConfig.gridSize, 9);
  var pads = normalizePads(safeConfig.pads, safeConfig.padsText, preset.pads, gridSize);
  var startingSequenceLength = readBoundedNumber(safeConfig.startingSequenceLength, 3, 1, 16);
  var maximumSequenceLength = readBoundedNumber(safeConfig.maximumSequenceLength, 8, startingSequenceLength, 32);
  var effectiveTemplate = activityTemplate === "algorithm-trace" ? "pattern-repeat" : "synth-sequence";

  if (activityTemplate === "pattern-repeat") {
    effectiveTemplate = "pattern-repeat";
  }

  return {
    stepType: "sequence-memory",
    activityTemplate: activityTemplate,
    effectiveTemplate: effectiveTemplate,
    title: readString(safeConfig.title, "Sequence Memory"),
    instructions: readString(safeConfig.instructions, "Watch the pattern, then repeat it using the pads."),
    gridSize: gridSize,
    startingSequenceLength: startingSequenceLength,
    maximumSequenceLength: maximumSequenceLength,
    soundEnabled: readBoolean(safeConfig.soundEnabled, preset.soundEnabled) && effectiveTemplate === "synth-sequence",
    timerEnabled: readBoolean(safeConfig.timerEnabled, false),
    completionRule: readCompletionRule(safeConfig.completionRule),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    pads: pads,
    comingSoonTemplate: activityTemplate === "rhythm-builder" || activityTemplate === "algorithm-trace" ? activityTemplate : "",
    valid: pads.length >= 2 && startingSequenceLength <= maximumSequenceLength
  };
}

export function createDefaultSequencePadsText() {
  return createDefaultPadsText();
}

function normalizePads(arrayValue, textValue, presetPads, gridSize) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizePad).filter(Boolean) : [];
  var fromText = parsePadsText(textValue);
  var pads = fromArray.length > 0 ? fromArray : fromText;

  if (pads.length === 0) {
    pads = presetPads.map(normalizePad).filter(Boolean);
  }

  return pads.slice(0, gridSize).map(function (pad, index) {
    return {
      id: readString(pad.id, "pad-" + index),
      label: readString(pad.label, String(index + 1)),
      icon: readString(pad.icon, "pad"),
      frequency: readPositiveNumber(pad.frequency, 261.63 + index * 35)
    };
  });
}

function parsePadsText(value) {
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

    return normalizePad({
      id: "pad-" + index,
      label: parts[0],
      icon: parts[1] || "pad",
      frequency: parts[2]
    });
  }).filter(Boolean);
}

function normalizePad(pad) {
  var safePad = pad && typeof pad === "object" ? pad : {};
  var label = readString(safePad.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safePad.id, slugify(label)),
    label: label,
    icon: readString(safePad.icon, "pad"),
    frequency: readPositiveNumber(safePad.frequency, 261.63)
  };
}

function readTemplate(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedTemplates[safeValue] ? safeValue : SEQUENCE_MEMORY_DEFAULT_TEMPLATE;
}

function readSubjectTheme(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";
  var preset = readSequenceMemoryTheme(safeValue);

  return preset.id || SEQUENCE_MEMORY_DEFAULT_THEME;
}

function readCompletionRule(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedRules[safeValue] ? safeValue : "reach-max-sequence";
}

function readGridSize(value, fallbackValue) {
  var number = Math.round(Number(value));

  if (number === 4 || number === 9 || number === 16) {
    return number;
  }

  return fallbackValue;
}

function readBoundedNumber(value, fallbackValue, min, max) {
  var number = Math.round(Number(value));

  if (!Number.isFinite(number)) {
    number = fallbackValue;
  }

  return Math.max(min, Math.min(max, number));
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

  return fallbackValue === true;
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}

function slugify(value) {
  return String(value || "pad")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "pad";
}
