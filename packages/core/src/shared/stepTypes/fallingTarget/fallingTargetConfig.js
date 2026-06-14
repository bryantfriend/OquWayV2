import {
  FALLING_TARGET_DEFAULT_THEME,
  readFallingTargetPreset
} from "./fallingTargetPresets.js?v=1.1.192-timed-sequence";

export function normalizeFallingTargetConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readFallingTargetPreset(subjectTheme);
  var settings = safeConfig.settings && typeof safeConfig.settings === "object" ? safeConfig.settings : {};

  return {
    stepType: "practice-challenge",
    activityTemplate: "falling-target-challenge",
    title: readString(safeConfig.title, "Falling Target Challenge"),
    instructions: readString(safeConfig.instructions, "Tap falling targets before they reach the danger zone."),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    targetName: readString(safeConfig.targetName, "Target"),
    dangerZoneName: readString(safeConfig.dangerZoneName, preset.dangerZoneName),
    startingLives: readPositiveNumber(safeConfig.startingLives, 5),
    targetScore: readPositiveNumber(safeConfig.targetScore, 1000),
    timeLimitSeconds: readPositiveNumber(safeConfig.timeLimitSeconds, 120),
    completionRule: readRule(safeConfig.completionRule),
    gameMode: readMode(safeConfig.gameMode),
    settings: {
      allowPowerUps: readBoolean(safeConfig.allowPowerUps, readBoolean(settings.allowPowerUps, true)),
      increaseDifficulty: readBoolean(safeConfig.increaseDifficulty, readBoolean(settings.increaseDifficulty, true)),
      penalizeMissedTargets: readBoolean(safeConfig.penalizeMissedTargets, readBoolean(settings.penalizeMissedTargets, true))
    },
    fallingTargets: normalizeTargets(safeConfig.fallingTargets, safeConfig.fallingTargetsText, preset.fallingTargets),
    valid: true
  };
}

function normalizeTargets(arrayValue, textValue, presetTargets) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeTarget).filter(Boolean) : [];
  var fromText = splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");
    return normalizeTarget({
      id: slugify(parts[0] || ("target-" + index)),
      label: parts[0],
      icon: parts[1],
      points: parts[2],
      damage: parts[3],
      type: parts[4],
      effect: parts[5]
    });
  }).filter(Boolean);
  var targets = fromArray.length > 0 ? fromArray : fromText;

  return targets.length > 0 ? targets : presetTargets.map(function (target) {
    return Object.assign({}, target);
  });
}

function normalizeTarget(target) {
  var safeTarget = target && typeof target === "object" ? target : {};
  var label = readString(safeTarget.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safeTarget.id, slugify(label)),
    label: label,
    icon: readString(safeTarget.icon, label.slice(0, 4).toUpperCase()),
    points: readPositiveNumber(safeTarget.points, 100),
    damage: readPositiveNumber(safeTarget.damage, 1),
    type: readString(safeTarget.type, "enemy"),
    effect: readString(safeTarget.effect, ""),
    durationSeconds: readPositiveNumber(safeTarget.durationSeconds, 3)
  };
}

function readSupportedTheme(value) {
  var preset = readFallingTargetPreset(typeof value === "string" ? value.trim() : "");
  return preset.id || FALLING_TARGET_DEFAULT_THEME;
}

function readRule(value) {
  return ["target-score", "survive-time", "target-score-or-time", "lives-depleted"].indexOf(value) >= 0 ? value : "target-score-or-time";
}

function readMode(value) {
  return ["classic-shooter", "correct-target-only", "survival-rush", "knowledge-catch"].indexOf(value) >= 0 ? value : "classic-shooter";
}

function splitLines(value) {
  return typeof value === "string" ? value.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean) : [];
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : fallbackValue;
}

function readBoolean(value, fallbackValue) {
  if (value === true || value === "true") { return true; }
  if (value === false || value === "false") { return false; }
  return fallbackValue;
}

function slugify(value) {
  return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
}
