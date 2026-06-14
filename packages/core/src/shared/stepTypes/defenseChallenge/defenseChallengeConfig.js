import {
  DEFENSE_CHALLENGE_DEFAULT_THEME,
  readDefenseChallengePreset
} from "./defenseChallengePresets.js?v=1.1.192-timed-sequence";

export var DEFENSE_CHALLENGE_TEMPLATE_ID = "defense-challenge";
export var DEFENSE_CHALLENGE_DEFAULT_MODE = "classic-defense";

var supportedModes = {
  "classic-defense": true,
  "correct-defense": true,
  "survival-mode": true,
  "boss-defense": true
};

var supportedCompletionRules = {
  "target-score": true,
  "survive-time": true,
  "target-score-or-time": true,
  "defeat-bosses": true
};

export function normalizeDefenseChallengeConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectTheme = readSupportedTheme(safeConfig.subjectTheme);
  var preset = readDefenseChallengePreset(subjectTheme);
  var gameMode = readGameMode(safeConfig.gameMode);
  var settings = normalizeSettings(safeConfig, gameMode);
  var targetHp = readPositiveNumber(safeConfig.targetHp, 100);
  var threats = normalizeThreats(safeConfig.threats, safeConfig.threatsText, preset.threats, settings);
  var powerUps = normalizePowerUps(safeConfig.powerUps, safeConfig.powerUpsText, preset.powerUps, settings);

  return {
    stepType: "practice-challenge",
    activityTemplate: DEFENSE_CHALLENGE_TEMPLATE_ID,
    title: readString(safeConfig.title, "Defense Challenge"),
    instructions: readString(safeConfig.instructions, readDefaultInstructions(gameMode, preset.protectedTargetName)),
    subjectTheme: subjectTheme,
    subjectThemeName: preset.name,
    protectedTargetName: readString(safeConfig.protectedTargetName, preset.protectedTargetName),
    targetHp: targetHp,
    targetScore: readPositiveNumber(safeConfig.targetScore, 1000),
    timeLimitSeconds: readPositiveNumber(safeConfig.timeLimitSeconds, 120),
    completionRule: readCompletionRule(safeConfig.completionRule, gameMode),
    gameMode: gameMode,
    settings: settings,
    threats: threats,
    powerUps: powerUps,
    maxActiveObjects: gameMode === "survival-mode" ? 8 : 6,
    valid: threats.length > 0
  };
}

export function serializeDefenseThreatsForEditor(threats) {
  return (Array.isArray(threats) ? threats : []).map(function (threat) {
    return [
      readString(threat.label, "Threat"),
      readString(threat.icon, "THRT"),
      readPositiveNumber(threat.points, 100),
      readPositiveNumber(threat.damage, 10),
      readPositiveNumber(threat.hp, 1),
      threat.isBoss === true ? "true" : "false"
    ].join("|");
  }).join("\n");
}

export function serializeDefensePowerUpsForEditor(powerUps) {
  return (Array.isArray(powerUps) ? powerUps : []).map(function (powerUp) {
    return [
      readString(powerUp.label, "Power Up"),
      readString(powerUp.icon, "UP"),
      readPositiveNumber(powerUp.healAmount, 25)
    ].join("|");
  }).join("\n");
}

function normalizeSettings(config, gameMode) {
  var rawSettings = config.settings && typeof config.settings === "object" && !Array.isArray(config.settings)
    ? config.settings
    : {};

  return {
    allowHealthPacks: readBoolean(config.allowHealthPacks, readBoolean(rawSettings.allowHealthPacks, true)),
    allowBossThreats: gameMode === "boss-defense" ? true : readBoolean(config.allowBossThreats, readBoolean(rawSettings.allowBossThreats, true)),
    penalizeMissedClicks: readBoolean(config.penalizeMissedClicks, readBoolean(rawSettings.penalizeMissedClicks, true)),
    penalizeMissedThreats: readBoolean(config.penalizeMissedThreats, readBoolean(rawSettings.penalizeMissedThreats, true))
  };
}

function readSupportedTheme(themeId) {
  var safeThemeId = typeof themeId === "string" ? themeId.trim() : "";
  var preset = readDefenseChallengePreset(safeThemeId);

  return preset.id || DEFENSE_CHALLENGE_DEFAULT_THEME;
}

function readGameMode(gameMode) {
  var safeGameMode = typeof gameMode === "string" ? gameMode.trim() : "";

  return supportedModes[safeGameMode] ? safeGameMode : DEFENSE_CHALLENGE_DEFAULT_MODE;
}

function readCompletionRule(rule, gameMode) {
  var safeRule = typeof rule === "string" ? rule.trim() : "";

  if (gameMode === "survival-mode" && (!safeRule || safeRule === "target-score")) {
    return "survive-time";
  }

  if (gameMode === "boss-defense" && !safeRule) {
    return "defeat-bosses";
  }

  return supportedCompletionRules[safeRule] ? safeRule : "target-score-or-time";
}

function normalizeThreats(arrayValue, textValue, presetThreats, settings) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeThreat).filter(Boolean) : [];
  var fromText = parseThreatLines(textValue);
  var threats = fromArray.length > 0 ? fromArray : fromText;

  if (threats.length === 0) {
    threats = presetThreats.map(function (threat) {
      return Object.assign({}, threat);
    });
  }

  if (!settings.allowBossThreats) {
    threats = threats.filter(function (threat) {
      return threat.isBoss !== true;
    });
  }

  return threats;
}

function normalizePowerUps(arrayValue, textValue, presetPowerUps, settings) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizePowerUp).filter(Boolean) : [];
  var fromText = parsePowerUpLines(textValue);
  var powerUps = fromArray.length > 0 ? fromArray : fromText;

  if (powerUps.length === 0 && settings.allowHealthPacks) {
    powerUps = presetPowerUps.map(function (powerUp) {
      return Object.assign({}, powerUp);
    });
  }

  return settings.allowHealthPacks ? powerUps : [];
}

function parseThreatLines(textValue) {
  return splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");

    return normalizeThreat({
      id: slugify(parts[0] || ("threat-" + index)),
      label: parts[0],
      icon: parts[1],
      points: parts[2],
      damage: parts[3],
      hp: parts[4],
      isBoss: parts[5]
    });
  }).filter(Boolean);
}

function parsePowerUpLines(textValue) {
  return splitLines(textValue).map(function (line, index) {
    var parts = line.split("|");

    return normalizePowerUp({
      id: slugify(parts[0] || ("power-up-" + index)),
      label: parts[0],
      icon: parts[1],
      healAmount: parts[2]
    });
  }).filter(Boolean);
}

function normalizeThreat(threat) {
  var safeThreat = threat && typeof threat === "object" ? threat : {};
  var label = readString(safeThreat.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safeThreat.id, slugify(label)),
    label: label,
    icon: readString(safeThreat.icon, label.slice(0, 4).toUpperCase()),
    points: readPositiveNumber(safeThreat.points, safeThreat.isBoss === true ? 500 : 100),
    damage: readPositiveNumber(safeThreat.damage, safeThreat.isBoss === true ? 20 : 10),
    hp: readPositiveNumber(safeThreat.hp, safeThreat.isBoss === true ? 3 : 1),
    isCorrect: safeThreat.isCorrect === false ? false : true,
    isBoss: readBoolean(safeThreat.isBoss, false)
  };
}

function normalizePowerUp(powerUp) {
  var safePowerUp = powerUp && typeof powerUp === "object" ? powerUp : {};
  var label = readString(safePowerUp.label, "");

  if (!label) {
    return null;
  }

  return {
    id: readString(safePowerUp.id, slugify(label)),
    label: label,
    icon: readString(safePowerUp.icon, "UP"),
    healAmount: readPositiveNumber(safePowerUp.healAmount, 25)
  };
}

function readDefaultInstructions(gameMode, protectedTargetName) {
  if (gameMode === "survival-mode") {
    return "Protect the " + protectedTargetName + " until the timer ends.";
  }

  if (gameMode === "correct-defense") {
    return "Click only the threats that match the prompt and ignore decoys.";
  }

  if (gameMode === "boss-defense") {
    return "Defeat boss threats before they damage the " + protectedTargetName + ".";
  }

  return "Click threats before they reach the " + protectedTargetName + ". Use health packs to recover.";
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
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return fallbackValue;
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return fallbackValue;
  }

  return Math.round(number);
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
