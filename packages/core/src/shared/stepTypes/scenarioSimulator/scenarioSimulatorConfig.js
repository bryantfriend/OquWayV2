import {
  SCENARIO_SIMULATOR_DEFAULT_PRESET,
  createDefaultScenarioText,
  readScenarioSimulatorPreset
} from "./scenarioPresetLibrary.js?v=1.1.192-timed-sequence";
import { readTimerSecondsForDifficulty } from "./scenarioTimerUtils.js?v=1.1.192-timed-sequence";

export var SCENARIO_SIMULATOR_DEFAULT_TEMPLATE = "rapid-decision";

var supportedTemplates = {
  "rapid-decision": true,
  "branching-story": true,
  "crisis-command": true,
  "ethical-dilemma": true
};

var supportedRules = {
  "all-scenarios-complete": true,
  "minimum-score": true,
  "survival-mode": true
};

export function normalizeScenarioSimulatorConfig(config) {
  var safeConfig = config && typeof config === "object" && !Array.isArray(config) ? config : {};
  var subjectPreset = readSubjectPreset(safeConfig.subjectPreset);
  var preset = readScenarioSimulatorPreset(subjectPreset);
  var activityTemplate = readTemplate(safeConfig.activityTemplate || safeConfig._activityTemplate);
  var scenarios = normalizeScenarios(safeConfig.scenarios, safeConfig.scenariosText, preset.scenarios);
  var difficulty = readDifficulty(safeConfig.difficulty);
  var timerSeconds = readTimerSecondsForDifficulty(difficulty, safeConfig.timerSeconds);

  return {
    stepType: "scenario-simulator",
    activityTemplate: activityTemplate,
    title: readString(safeConfig.title, "Scenario Simulator"),
    instructions: readString(safeConfig.instructions, "Read the situation and choose the best action before the timer runs out."),
    subjectPreset: subjectPreset,
    subjectPresetName: preset.name,
    timerSeconds: timerSeconds,
    difficulty: difficulty,
    completionRule: readCompletionRule(safeConfig.completionRule),
    minimumScore: readPositiveNumber(safeConfig.minimumScore, 300),
    scenarios: scenarios,
    comingSoonTemplate: activityTemplate === "rapid-decision" ? "" : activityTemplate,
    valid: scenarios.length > 0
  };
}

export function createDefaultScenariosText() {
  return createDefaultScenarioText();
}

function normalizeScenarios(arrayValue, textValue, presetScenarios) {
  var fromArray = Array.isArray(arrayValue) ? arrayValue.map(normalizeScenario).filter(Boolean) : [];
  var fromText = parseScenarioText(textValue);
  var scenarios = fromArray.length > 0 ? fromArray : fromText;

  if (scenarios.length === 0) {
    scenarios = presetScenarios.map(function (scenario) {
      return normalizeScenario(scenario);
    }).filter(Boolean);
  }

  return scenarios;
}

function parseScenarioText(textValue) {
  if (typeof textValue !== "string" || textValue.trim().length === 0) {
    return [];
  }

  return textValue.split(/\n---+\n/g).map(function (block, index) {
    var scenario = {
      id: "scenario-" + (index + 1),
      title: "",
      descriptionLines: [],
      prompt: "",
      correctAction: "",
      incorrectActions: [],
      successFeedback: "",
      failureFeedback: ""
    };

    splitLines(block).forEach(function (line) {
      var dividerIndex = line.indexOf(":");
      var key = dividerIndex >= 0 ? line.slice(0, dividerIndex).trim().toLowerCase() : "";
      var value = dividerIndex >= 0 ? line.slice(dividerIndex + 1).trim() : "";

      if (key === "title") {
        scenario.title = value;
      } else if (key === "description" || key === "description lines") {
        scenario.descriptionLines = splitPipedList(value);
      } else if (key === "prompt") {
        scenario.prompt = value;
      } else if (key === "correct" || key === "correct action") {
        scenario.correctAction = value;
      } else if (key === "incorrect" || key === "incorrect actions") {
        scenario.incorrectActions = splitPipedList(value);
      } else if (key === "success" || key === "success feedback") {
        scenario.successFeedback = value;
      } else if (key === "failure" || key === "failure feedback") {
        scenario.failureFeedback = value;
      }
    });

    return normalizeScenario(scenario);
  }).filter(Boolean);
}

function normalizeScenario(scenario) {
  var safeScenario = scenario && typeof scenario === "object" ? scenario : {};
  var title = readString(safeScenario.title, "");
  var correctAction = readString(safeScenario.correctAction, "");

  if (!title || !correctAction) {
    return null;
  }

  return {
    id: readString(safeScenario.id, slugify(title)),
    title: title,
    descriptionLines: normalizeDescriptionLines(safeScenario.descriptionLines),
    prompt: readString(safeScenario.prompt, "Choose the best action."),
    correctAction: correctAction,
    incorrectActions: normalizeIncorrectActions(safeScenario.incorrectActions, correctAction),
    successFeedback: readString(safeScenario.successFeedback, "Correct decision."),
    failureFeedback: readString(safeScenario.failureFeedback, "That choice did not solve the situation.")
  };
}

function normalizeDescriptionLines(value) {
  if (Array.isArray(value)) {
    return value.map(function (line) {
      return readString(line, "");
    }).filter(Boolean);
  }

  return splitPipedList(value);
}

function normalizeIncorrectActions(value, correctAction) {
  var list = Array.isArray(value) ? value : splitPipedList(value);
  var normalizedCorrect = correctAction.toLowerCase();

  return list.map(function (action) {
    return readString(action, "");
  }).filter(function (action, index, actions) {
    return action && action.toLowerCase() !== normalizedCorrect && actions.indexOf(action) === index;
  });
}

function readTemplate(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedTemplates[safeValue] ? safeValue : SCENARIO_SIMULATOR_DEFAULT_TEMPLATE;
}

function readSubjectPreset(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";
  var preset = readScenarioSimulatorPreset(safeValue);

  return preset.id || SCENARIO_SIMULATOR_DEFAULT_PRESET;
}

function readDifficulty(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return ["easy", "medium", "hard", "custom"].indexOf(safeValue) >= 0 ? safeValue : "medium";
}

function readCompletionRule(value) {
  var safeValue = typeof value === "string" ? value.trim() : "";

  return supportedRules[safeValue] ? safeValue : "all-scenarios-complete";
}

function splitLines(value) {
  return typeof value === "string" ? value.split(/\r?\n/).map(function (line) {
    return line.trim();
  }).filter(Boolean) : [];
}

function splitPipedList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  return value.split("|").map(function (line) {
    return line.trim();
  }).filter(Boolean);
}

function readString(value, fallbackValue) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallbackValue;
}

function readPositiveNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : fallbackValue;
}

function slugify(value) {
  return String(value || "scenario")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "scenario";
}
