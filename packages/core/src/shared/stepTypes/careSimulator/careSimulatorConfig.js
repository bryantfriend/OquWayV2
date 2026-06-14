import {
  CARE_SIMULATOR_DEFAULT_THEME,
  readCareSimulatorPreset
} from "./careSimulatorPresets.js?v=1.1.192-timed-sequence";

export function normalizeCareSimulatorConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readCareSimulatorPreset(subjectTheme);
  var settings = safeConfig.settings && typeof safeConfig.settings === "object" ? safeConfig.settings : {};

  return {
    stepType: "practice-challenge",
    activityTemplate: "care-simulator",
    title: readString(safeConfig.title, "Care Simulator"),
    instructions: readString(safeConfig.instructions, "Give helpful resources to keep the status healthy."),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    characterName: readString(safeConfig.characterName, preset.characterName),
    characterType: readString(safeConfig.characterType, preset.characterType),
    statusMeterName: readString(safeConfig.statusMeterName, preset.statusMeterName),
    startingStatus: readPositiveNumber(safeConfig.startingStatus, 70),
    targetStatus: readPositiveNumber(safeConfig.targetStatus, 80),
    timeLimitSeconds: readPositiveNumber(safeConfig.timeLimitSeconds, 120),
    completionRule: readRule(safeConfig.completionRule),
    gameMode: readMode(safeConfig.gameMode),
    settings: {
      allowWrongResources: readBoolean(safeConfig.allowWrongResources, readBoolean(settings.allowWrongResources, true)),
      statusDecayRate: readPositiveNumber(safeConfig.statusDecayRate, readPositiveNumber(settings.statusDecayRate, 1.5)),
      showMood: readBoolean(safeConfig.showMood, readBoolean(settings.showMood, true)),
      allowFreePlacement: readBoolean(safeConfig.allowFreePlacement, readBoolean(settings.allowFreePlacement, true))
    },
    resources: normalizeResources(safeConfig.resources, safeConfig.resourcesText, preset.resources)
  };
}

function normalizeResources(value, textValue, fallback) {
  var fromText = splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");
    return {
      id: slugify(parts[0] || ("resource-" + index)),
      label: parts[0],
      icon: parts[1],
      statusEffect: parts[2],
      type: parts[3]
    };
  });
  var list = Array.isArray(value) && value.length > 0 ? value : fromText.length > 0 ? fromText : fallback;
  return list.map(function (item, index) {
    var label = readString(item.label, "Resource " + (index + 1));
    return { id: readString(item.id, slugify(label)), label: label, icon: readString(item.icon, label.slice(0, 4).toUpperCase()), statusEffect: readNumber(item.statusEffect, 20), type: readString(item.type, "helpful") };
  });
}

function splitLines(value) {
  return typeof value === "string" ? value.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean) : [];
}

function readSupportedTheme(value) {
  var preset = readCareSimulatorPreset(typeof value === "string" ? value.trim() : "");
  return preset.id || CARE_SIMULATOR_DEFAULT_THEME;
}

function readRule(value) {
  return ["maintain-status", "reach-status", "resource-count", "time-played"].indexOf(value) >= 0 ? value : "maintain-status";
}

function readMode(value) {
  return ["classic-care", "resource-matching", "maintain-balance", "scenario-care"].indexOf(value) >= 0 ? value : "classic-care";
}

function readString(value, fallbackValue) { return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue; }
function readNumber(value, fallbackValue) { var number = Number(value); return Number.isFinite(number) ? Math.round(number * 100) / 100 : fallbackValue; }
function readPositiveNumber(value, fallbackValue) { var number = Number(value); return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : fallbackValue; }
function readBoolean(value, fallbackValue) { if (value === true || value === "true") { return true; } if (value === false || value === "false") { return false; } return fallbackValue; }
function slugify(value) { return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"; }
