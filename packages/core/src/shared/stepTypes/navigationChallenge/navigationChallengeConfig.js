import {
  NAVIGATION_CHALLENGE_DEFAULT_THEME,
  readNavigationChallengePreset
} from "./navigationChallengePresets.js?v=1.1.192-timed-sequence";

export function normalizeNavigationChallengeConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readNavigationChallengePreset(subjectTheme);
  var settings = safeConfig.settings && typeof safeConfig.settings === "object" ? safeConfig.settings : {};

  return {
    stepType: "practice-challenge",
    activityTemplate: "navigation-challenge",
    title: readString(safeConfig.title, "Navigation Challenge"),
    instructions: readString(safeConfig.instructions, "Move, collect helpful items, and avoid obstacles."),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    avatarType: readString(safeConfig.avatarType, preset.avatarType),
    collectibleName: readString(safeConfig.collectibleName, preset.collectibleName),
    obstacleName: readString(safeConfig.obstacleName, preset.obstacleName),
    actionName: preset.actionName,
    targetScore: readPositiveNumber(safeConfig.targetScore, 1000),
    timeLimitSeconds: readPositiveNumber(safeConfig.timeLimitSeconds, 120),
    completionRule: readRule(safeConfig.completionRule),
    gameMode: readMode(safeConfig.gameMode),
    settings: {
      allowShooting: readBoolean(safeConfig.allowShooting, readBoolean(settings.allowShooting, true)),
      allowCollectibles: readBoolean(safeConfig.allowCollectibles, readBoolean(settings.allowCollectibles, true)),
      increaseDifficulty: readBoolean(safeConfig.increaseDifficulty, readBoolean(settings.increaseDifficulty, true)),
      useInertia: readBoolean(safeConfig.useInertia, readBoolean(settings.useInertia, true))
    },
    obstacles: normalizeList(safeConfig.obstacles, preset.obstacles, "obstacle", 50),
    collectibles: normalizeList(safeConfig.collectibles, preset.collectibles, "collectible", 100)
  };
}

function normalizeList(value, fallback, type, points) {
  var list = Array.isArray(value) ? value : fallback;
  return list.map(function (item, index) {
    var label = readString(item.label, type + " " + (index + 1));
    return Object.assign({}, item, { id: readString(item.id, slugify(label)), label: label, type: readString(item.type, type), points: readPositiveNumber(item.points, points), damage: readPositiveNumber(item.damage, 1), canBeDestroyed: item.canBeDestroyed !== false });
  });
}

function readSupportedTheme(value) {
  var preset = readNavigationChallengePreset(typeof value === "string" ? value.trim() : "");
  return preset.id || NAVIGATION_CHALLENGE_DEFAULT_THEME;
}

function readRule(value) {
  return ["target-score", "survive-time", "target-score-or-time", "checkpoint-route"].indexOf(value) >= 0 ? value : "target-score-or-time";
}

function readMode(value) {
  return ["classic-navigation", "collect-correct-items", "survival-flight", "route-to-goal"].indexOf(value) >= 0 ? value : "classic-navigation";
}

function readString(value, fallbackValue) { return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue; }
function readPositiveNumber(value, fallbackValue) { var number = Number(value); return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : fallbackValue; }
function readBoolean(value, fallbackValue) { if (value === true || value === "true") { return true; } if (value === false || value === "false") { return false; } return fallbackValue; }
function slugify(value) { return String(value || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item"; }
