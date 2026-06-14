import {
  COMPETITIVE_COLLECTOR_DEFAULT_THEME,
  readCompetitiveCollectorPreset
} from "./competitiveCollectorPresets.js?v=1.1.192-timed-sequence";

export var COMPETITIVE_COLLECTOR_DEFAULT_MODE = "classic-collector";

var supportedGameModes = {
  "classic-collector": true,
  "correct-collector": true,
  "timed-sprint": true,
  "avoid-the-trap": true,
  "boss-challenge": true
};

var supportedCompletionRules = {
  "target-score": true,
  "time-limit": true,
  "target-score-or-time": true
};

export function normalizeCompetitiveCollectorConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readCompetitiveCollectorPreset(subjectTheme);
  var gameMode = readGameMode(safeConfig.gameMode);
  var targetScore = readPositiveNumber(safeConfig.targetScore, 1000);
  var timeLimitSeconds = readPositiveNumber(safeConfig.timeLimitSeconds, 120);
  var settings = normalizeSettings(safeConfig, gameMode);
  var collectibles = normalizeCollectibles(safeConfig.collectibles, safeConfig.collectiblesText, preset.collectibles, settings);
  var upgrades = normalizeUpgrades(safeConfig.upgrades, safeConfig.upgradesText, preset.upgrades);
  var rivals = normalizeRivals(safeConfig.rivals, safeConfig.rivalsText, preset.rivals);

  return {
    stepType: "practice-challenge",
    activityTemplate: "competitive-collector",
    title: readString(safeConfig.title, "Competitive Collector"),
    instructions: readString(safeConfig.instructions, readDefaultInstructions(gameMode, preset.resourceName)),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    resourceName: readString(safeConfig.resourceName, preset.resourceName),
    targetScore: targetScore,
    timeLimitSeconds: timeLimitSeconds,
    completionRule: readCompletionRule(safeConfig.completionRule, gameMode),
    gameMode: gameMode,
    settings: settings,
    collectibles: collectibles,
    upgrades: upgrades,
    rivals: rivals,
    valid: collectibles.length > 0
  };
}

export function serializeCollectiblesForEditor(collectibles) {
  var safeCollectibles = Array.isArray(collectibles) ? collectibles : [];

  return safeCollectibles.map(function (item) {
    return [
      readString(item.label, "Item"),
      readPositiveNumber(item.points, 10),
      readString(item.rarity, "common"),
      item.isCorrect === false ? "false" : "true"
    ].join("|");
  }).join("\n");
}

export function serializeUpgradesForEditor(upgrades) {
  var safeUpgrades = Array.isArray(upgrades) ? upgrades : [];

  return safeUpgrades.map(function (upgrade) {
    return [
      readString(upgrade.name, "Upgrade"),
      readPositiveNumber(upgrade.baseCost, 50),
      readPositiveNumber(upgrade.pointsPerSecond, 1),
      readPositiveNumber(upgrade.costMultiplier, 1.5)
    ].join("|");
  }).join("\n");
}

export function serializeRivalsForEditor(rivals) {
  return (Array.isArray(rivals) ? rivals : []).filter(function (rival) {
    return typeof rival === "string" && rival.trim().length > 0;
  }).join("\n");
}

function readSupportedTheme(themeId) {
  var safeThemeId = typeof themeId === "string" ? themeId.trim() : "";
  var preset = readCompetitiveCollectorPreset(safeThemeId);

  return preset.id || COMPETITIVE_COLLECTOR_DEFAULT_THEME;
}

function readGameMode(gameMode) {
  var safeGameMode = typeof gameMode === "string" ? gameMode.trim() : "";

  return supportedGameModes[safeGameMode] ? safeGameMode : COMPETITIVE_COLLECTOR_DEFAULT_MODE;
}

function readCompletionRule(completionRule, gameMode) {
  var safeRule = typeof completionRule === "string" ? completionRule.trim() : "";

  if (gameMode === "timed-sprint") {
    return "time-limit";
  }

  return supportedCompletionRules[safeRule] ? safeRule : "target-score-or-time";
}

function normalizeSettings(config, gameMode) {
  var rawSettings = config.settings && typeof config.settings === "object" && !Array.isArray(config.settings)
    ? config.settings
    : {};

  return {
    allowUpgrades: gameMode === "timed-sprint" ? false : readBoolean(config.allowUpgrades, readBoolean(rawSettings.allowUpgrades, true)),
    allowBonusItems: readBoolean(config.allowBonusItems, readBoolean(rawSettings.allowBonusItems, true)),
    showLeaderboard: readBoolean(config.showLeaderboard, readBoolean(rawSettings.showLeaderboard, true)),
    allowWrongItems: readBoolean(config.allowWrongItems, readBoolean(rawSettings.allowWrongItems, false))
  };
}

function normalizeCollectibles(arrayValue, textValue, presetCollectibles, settings) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeCollectible).filter(Boolean) : [];
  var fromText = parseCollectibleLines(textValue);
  var items = fromArray.length > 0 ? fromArray : fromText;

  if (items.length === 0) {
    items = presetCollectibles.map(function (item) {
      return Object.assign({}, item);
    });
  }

  if (!settings.allowBonusItems) {
    items = items.filter(function (item) {
      return item.rarity !== "rare";
    });
  }

  if (settings.allowWrongItems && !hasIncorrectItem(items)) {
    items.push({
      id: "decoy",
      label: "Decoy",
      points: 0,
      rarity: "common",
      isCorrect: false
    });
  }

  return items;
}

function parseCollectibleLines(textValue) {
  return splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");
    return normalizeCollectible({
      id: slugify(parts[0] || ("item-" + index)),
      label: parts[0],
      points: parts[1],
      rarity: parts[2],
      isCorrect: parts[3]
    });
  }).filter(Boolean);
}

function normalizeCollectible(item) {
  var safeItem = item && typeof item === "object" ? item : {};
  var label = readString(safeItem.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safeItem.id, slugify(label)),
    label: label,
    points: readNumber(safeItem.points, 10),
    rarity: readString(safeItem.rarity, "common"),
    isCorrect: readBoolean(safeItem.isCorrect, true)
  };
}

function normalizeUpgrades(arrayValue, textValue, presetUpgrades) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeUpgrade).filter(Boolean) : [];
  var fromText = parseUpgradeLines(textValue);
  var upgrades = fromArray.length > 0 ? fromArray : fromText;

  if (upgrades.length === 0) {
    upgrades = presetUpgrades.map(function (upgrade) {
      return Object.assign({}, upgrade);
    });
  }

  return upgrades;
}

function parseUpgradeLines(textValue) {
  return splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");
    return normalizeUpgrade({
      id: slugify(parts[0] || ("upgrade-" + index)),
      name: parts[0],
      baseCost: parts[1],
      pointsPerSecond: parts[2],
      costMultiplier: parts[3]
    });
  }).filter(Boolean);
}

function normalizeUpgrade(upgrade) {
  var safeUpgrade = upgrade && typeof upgrade === "object" ? upgrade : {};
  var name = readString(safeUpgrade.name, "");

  if (!name) {
    return null;
  }

  return {
    id: readString(safeUpgrade.id, slugify(name)),
    name: name,
    baseCost: readPositiveNumber(safeUpgrade.baseCost, 50),
    costMultiplier: readPositiveNumber(safeUpgrade.costMultiplier, 1.5),
    pointsPerSecond: readPositiveNumber(safeUpgrade.pointsPerSecond, 1)
  };
}

function normalizeRivals(arrayValue, textValue, presetRivals) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.filter(isNonEmptyString) : [];
  var fromText = splitLines(textValue);
  var rivals = fromArray.length > 0 ? fromArray : fromText;

  return rivals.length > 0 ? rivals : presetRivals.slice();
}

function hasIncorrectItem(items) {
  return items.some(function (item) {
    return item.isCorrect === false;
  });
}

function readDefaultInstructions(gameMode, resourceName) {
  if (gameMode === "correct-collector") {
    return "Collect only the correct items. Incorrect items give feedback.";
  }

  if (gameMode === "timed-sprint") {
    return "Collect as much " + resourceName + " as you can before time runs out.";
  }

  return "Collect items, buy upgrades, and reach the target score.";
}

function splitLines(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value.split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(Boolean);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function readString(value, fallbackValue) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return fallbackValue;
}

function readNumber(value, fallbackValue) {
  var number = Number(value);

  if (!Number.isFinite(number)) {
    return fallbackValue;
  }

  return Math.round(number);
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return fallbackValue;
  }

  return Math.round(number * 100) / 100;
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
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}
