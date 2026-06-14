import { BaseStep } from "./BaseStep.js?v=1.1.192-timed-sequence";
import { CompetitiveCollectorRenderer } from "./competitiveCollector/CompetitiveCollectorRenderer.js?v=1.1.192-timed-sequence";
import { listCompetitiveCollectorPresetOptions } from "./competitiveCollector/competitiveCollectorPresets.js?v=1.1.192-timed-sequence";
import { CareSimulatorRenderer } from "./careSimulator/CareSimulatorRenderer.js?v=1.1.192-timed-sequence";
import { listCareSimulatorPresetOptions } from "./careSimulator/careSimulatorPresets.js?v=1.1.192-timed-sequence";
import { DefenseChallengeRenderer } from "./defenseChallenge/DefenseChallengeRenderer.js?v=1.1.192-timed-sequence";
import { listDefenseChallengePresetOptions } from "./defenseChallenge/defenseChallengePresets.js?v=1.1.192-timed-sequence";
import { FallingTargetChallengeRenderer } from "./fallingTarget/FallingTargetChallengeRenderer.js?v=1.1.192-timed-sequence";
import { listFallingTargetPresetOptions } from "./fallingTarget/fallingTargetPresets.js?v=1.1.192-timed-sequence";
import { NavigationChallengeRenderer } from "./navigationChallenge/NavigationChallengeRenderer.js?v=1.1.192-timed-sequence";
import { listNavigationChallengePresetOptions } from "./navigationChallenge/navigationChallengePresets.js?v=1.1.192-timed-sequence";
import { TuningChallengeRenderer } from "./tuningChallenge/TuningChallengeRenderer.js?v=1.1.192-timed-sequence";
import { listTuningChallengePresetOptions } from "./tuningChallenge/tuningChallengePresets.js?v=1.1.192-timed-sequence";

export class PracticeChallengeStep extends BaseStep {
  static get type() {
    return "practice-challenge";
  }

  static get label() {
    return "Practice Challenge";
  }

  static get description() {
    return "Configurable practice games including collector, defense, tuning, navigation, falling target, and care challenges.";
  }

  static get category() {
    return "Game / Practice";
  }

  static get complexity() {
    return "Medium";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "interactive";
  }

  static get defaultConfig() {
    return {
      title: "Competitive Collector",
      instructions: "",
      subjectTheme: "ict-data-mining",
      protectedTargetName: "",
      targetHp: 100,
      targetType: "wave",
      controlLabels: "",
      targetValuesText: "",
      syncThreshold: 90,
      holdSeconds: 5,
      difficulty: "medium",
      resourceName: "",
      targetName: "",
      dangerZoneName: "",
      startingLives: 5,
      avatarType: "",
      collectibleName: "",
      obstacleName: "",
      characterName: "",
      characterType: "",
      statusMeterName: "",
      startingStatus: 70,
      targetStatus: 80,
      targetScore: 1000,
      timeLimitSeconds: 120,
      completionRule: "target-score-or-time",
      gameMode: "classic-collector",
      allowUpgrades: "true",
      allowBonusItems: "true",
      showLeaderboard: "true",
      allowWrongItems: "false",
      allowHealthPacks: "true",
      allowBossThreats: "true",
      allowPowerUps: "true",
      increaseDifficulty: "true",
      allowShooting: "true",
      allowCollectibles: "true",
      useInertia: "true",
      allowWrongResources: "true",
      statusDecayRate: 1.5,
      penalizeMissedClicks: "true",
      penalizeMissedThreats: "true",
      penalizeMissedTargets: "true",
      collectiblesText: "",
      upgradesText: "",
      rivalsText: "",
      threatsText: "",
      powerUpsText: "",
      fallingTargetsText: "",
      resourcesText: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Title", type: "text", section: "Basic Settings" },
        { key: "instructions", label: "Instructions", type: "textarea", section: "Basic Settings" },
        { key: "subjectTheme", label: "Subject Theme Preset", type: "select", options: practiceChallengeThemeOptions(), section: "Theme" },
        { key: "resourceName", label: "Resource Name", type: "text", section: "Theme", help: "Collector only. Leave blank to use the selected preset resource." },
        { key: "protectedTargetName", label: "Protected Target Name", type: "text", section: "Theme", help: "Defense only. Leave blank to use the selected defense preset target." },
        { key: "targetName", label: "Target Name", type: "text", section: "Theme", help: "Falling Target only." },
        { key: "dangerZoneName", label: "Danger Zone Name", type: "text", section: "Theme", help: "Falling Target only." },
        { key: "avatarType", label: "Avatar Type", type: "text", section: "Theme", help: "Navigation only." },
        { key: "collectibleName", label: "Collectible Name", type: "text", section: "Theme", help: "Navigation only." },
        { key: "obstacleName", label: "Obstacle Name", type: "text", section: "Theme", help: "Navigation only." },
        { key: "characterName", label: "Character Name", type: "text", section: "Character", help: "Care Simulator only." },
        { key: "characterType", label: "Character Type", type: "text", section: "Character", help: "Care Simulator only." },
        { key: "statusMeterName", label: "Status Meter Name", type: "text", section: "Character", help: "Care Simulator only." },
        { key: "targetScore", label: "Target Score", type: "number", section: "Game Rules" },
        { key: "targetHp", label: "Target HP", type: "number", section: "Game Rules" },
        { key: "startingLives", label: "Starting Lives", type: "number", section: "Game Rules" },
        { key: "startingStatus", label: "Starting Status", type: "number", section: "Game Rules" },
        { key: "targetStatus", label: "Target Status", type: "number", section: "Game Rules" },
        { key: "timeLimitSeconds", label: "Time Limit", type: "number", section: "Game Rules" },
        { key: "completionRule", label: "Completion Rule", type: "select", options: completionRuleOptions(), section: "Game Rules" },
        { key: "gameMode", label: "Game Mode", type: "select", options: gameModeOptions(), section: "Game Rules" },
        { key: "difficulty", label: "Difficulty", type: "select", options: difficultyOptions(), section: "Game Rules" },
        { key: "targetType", label: "Target Type", type: "select", options: targetTypeOptions(), section: "Tuning" },
        { key: "syncThreshold", label: "Sync Threshold", type: "number", section: "Tuning" },
        { key: "holdSeconds", label: "Hold Seconds", type: "number", section: "Tuning" },
        { key: "controlLabels", label: "Control Labels", type: "textarea", section: "Tuning", help: "One per line. Example: Frequency, then Amplitude." },
        { key: "targetValuesText", label: "Target Values", type: "textarea", section: "Tuning", help: "One per line: Control|Value. Example: frequency|7.2." },
        { key: "allowUpgrades", label: "Allow Upgrades", type: "select", options: boolOptions(), section: "Collector Rules" },
        { key: "allowBonusItems", label: "Allow Bonus Items", type: "select", options: boolOptions(), section: "Collector Rules" },
        { key: "allowHealthPacks", label: "Allow Health Packs", type: "select", options: boolOptions(), section: "Power-Ups" },
        { key: "allowPowerUps", label: "Allow Power-Ups", type: "select", options: boolOptions(), section: "Power-Ups" },
        { key: "allowBossThreats", label: "Allow Boss Threats", type: "select", options: boolOptions(), section: "Threats" },
        { key: "allowShooting", label: "Allow Shooting", type: "select", options: boolOptions(), section: "Controls" },
        { key: "allowCollectibles", label: "Allow Collectibles", type: "select", options: boolOptions(), section: "Collectibles" },
        { key: "useInertia", label: "Use Inertia", type: "select", options: boolOptions(), section: "Controls" },
        { key: "allowWrongResources", label: "Allow Wrong Resources", type: "select", options: boolOptions(), section: "Resources" },
        { key: "statusDecayRate", label: "Status Decay Rate", type: "number", section: "Status Rules" },
        { key: "increaseDifficulty", label: "Difficulty Increase", type: "select", options: boolOptions(), section: "Game Rules" },
        { key: "penalizeMissedClicks", label: "Penalty for Missed Clicks", type: "select", options: boolOptions(), section: "Defense Rules" },
        { key: "penalizeMissedThreats", label: "Penalty for Missed Threats", type: "select", options: boolOptions(), section: "Defense Rules" },
        { key: "penalizeMissedTargets", label: "Penalty for Missed Targets", type: "select", options: boolOptions(), section: "Falling Targets" },
        { key: "allowWrongItems", label: "Allow Wrong Items", type: "select", options: boolOptions(), section: "Collectibles" },
        { key: "collectiblesText", label: "Collectibles", type: "textarea", section: "Collectibles", help: "One per line: Label|Points|Rarity|Correct. Example: Golden Server|100|rare|true." },
        { key: "threatsText", label: "Threats", type: "textarea", section: "Threats", help: "One per line: Label|Icon|Points|Damage|HP|Boss. Example: Boss Bug|BOSS|500|20|3|true." },
        { key: "fallingTargetsText", label: "Falling Targets", type: "textarea", section: "Falling Targets", help: "One per line: Label|Icon|Points|Damage|Type|Effect." },
        { key: "upgradesText", label: "Upgrades", type: "textarea", section: "Upgrades", help: "One per line: Name|Base Cost|Points Per Second|Cost Multiplier." },
        { key: "powerUpsText", label: "Power-Ups", type: "textarea", section: "Power-Ups", help: "One per line: Label|Icon|Heal Amount. Example: Health Patch|HP|25." },
        { key: "resourcesText", label: "Resource Items", type: "textarea", section: "Resources", help: "One per line: Label|Icon|Status Effect|Type. Example: Power|PWR|40|helpful." },
        { key: "showLeaderboard", label: "Show Leaderboard", type: "select", options: boolOptions(), section: "Leaderboard" },
        { key: "rivalsText", label: "Rivals", type: "textarea", section: "Leaderboard", help: "One rival name per line. Leave blank to use preset rivals." }
      ]
    };
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeConfig = this.createConfig(config);
    var complete = this.createCompletionGuard(callbacks && callbacks.onComplete);
    var renderer = readPracticeChallengeRenderer(safeConfig);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    renderer.attachPlayerHandlers(container, safeConfig, complete);
  }

  static renderPlayerShell(config) {
    var safeConfig = this.createConfig(config);

    return readPracticeChallengeRenderer(safeConfig).renderPlayerShell(this, safeConfig);
  }
}

function boolOptions() {
  return [
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ];
}

function completionRuleOptions() {
  return [
    { value: "target-score-or-time", label: "Target Score or Time" },
    { value: "target-score", label: "Target Score" },
    { value: "time-limit", label: "Time Limit" },
    { value: "survive-time", label: "Survive Time" },
    { value: "defeat-bosses", label: "Defeat Bosses" },
    { value: "sync-threshold", label: "Sync Threshold" },
    { value: "sync-hold", label: "Sync Hold" },
    { value: "lives-depleted", label: "Lives Depleted" },
    { value: "checkpoint-route", label: "Checkpoint Route" },
    { value: "maintain-status", label: "Maintain Status" },
    { value: "reach-status", label: "Reach Status" },
    { value: "resource-count", label: "Resource Count" },
    { value: "time-played", label: "Time Played" }
  ];
}

function gameModeOptions() {
  return [
    { value: "classic-collector", label: "Classic Collector" },
    { value: "correct-collector", label: "Correct Collector" },
    { value: "timed-sprint", label: "Timed Sprint" },
    { value: "avoid-the-trap", label: "Avoid the Trap" },
    { value: "boss-challenge", label: "Boss Challenge" },
    { value: "classic-defense", label: "Classic Defense" },
    { value: "correct-defense", label: "Correct Defense" },
    { value: "survival-mode", label: "Survival Mode" },
    { value: "boss-defense", label: "Boss Defense" },
    { value: "wave-tuner", label: "Wave Tuner" },
    { value: "graph-match", label: "Graph Match" },
    { value: "signal-stabilizer", label: "Signal Stabilizer" },
    { value: "color-match", label: "Color Match" },
    { value: "classic-shooter", label: "Classic Shooter" },
    { value: "correct-target-only", label: "Correct Target Only" },
    { value: "survival-rush", label: "Survival Rush" },
    { value: "knowledge-catch", label: "Knowledge Catch" },
    { value: "classic-navigation", label: "Classic Navigation" },
    { value: "collect-correct-items", label: "Collect Correct Items" },
    { value: "survival-flight", label: "Survival Flight" },
    { value: "route-to-goal", label: "Route to Goal" },
    { value: "classic-care", label: "Classic Care" },
    { value: "resource-matching", label: "Resource Matching" },
    { value: "maintain-balance", label: "Maintain Balance" },
    { value: "scenario-care", label: "Scenario Care" }
  ];
}

function targetTypeOptions() {
  return [
    { value: "wave", label: "Wave" },
    { value: "graph", label: "Graph" },
    { value: "signal", label: "Signal" },
    { value: "color", label: "Color" }
  ];
}

function difficultyOptions() {
  return [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" }
  ];
}

function practiceChallengeThemeOptions() {
  return listCompetitiveCollectorPresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Collector - " + option.label
    };
  }).concat(listDefenseChallengePresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Defense - " + option.label
    };
  })).concat(listTuningChallengePresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Tuning - " + option.label
    };
  })).concat(listFallingTargetPresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Falling - " + option.label
    };
  })).concat(listNavigationChallengePresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Navigation - " + option.label
    };
  })).concat(listCareSimulatorPresetOptions().map(function (option) {
    return {
      value: option.value,
      label: "Care - " + option.label
    };
  }));
}

function readPracticeChallengeRenderer(config) {
  var template = "";

  if (config && typeof config._activityTemplate === "string") {
    template = config._activityTemplate.trim();
  } else if (config && typeof config.activityTemplate === "string") {
    template = config.activityTemplate.trim();
  }

  if (template === "defense-challenge") {
    return DefenseChallengeRenderer;
  }

  if (template === "tuning-challenge") {
    return TuningChallengeRenderer;
  }

  if (template === "falling-target-challenge") {
    return FallingTargetChallengeRenderer;
  }

  if (template === "navigation-challenge") {
    return NavigationChallengeRenderer;
  }

  if (template === "care-simulator") {
    return CareSimulatorRenderer;
  }

  return CompetitiveCollectorRenderer;
}
