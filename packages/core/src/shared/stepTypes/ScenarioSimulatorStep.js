import { BaseStep } from "./BaseStep.js?v=1.1.192-timed-sequence";
import { ScenarioSimulatorRenderer } from "./scenarioSimulator/ScenarioSimulatorRenderer.js?v=1.1.192-timed-sequence";
import {
  createDefaultScenariosText,
  normalizeScenarioSimulatorConfig
} from "./scenarioSimulator/scenarioSimulatorConfig.js?v=1.1.192-timed-sequence";
import { listScenarioSimulatorPresetOptions } from "./scenarioSimulator/scenarioPresetLibrary.js?v=1.1.192-timed-sequence";

export class ScenarioSimulatorStep extends BaseStep {
  static get type() {
    return "scenario-simulator";
  }

  static get label() {
    return "Scenario Simulator";
  }

  static get description() {
    return "Students make realistic decisions under time pressure and learn from feedback.";
  }

  static get category() {
    return "Decision / Simulation";
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
      title: "Terminal Link",
      instructions: "Read the situation and choose the correct action before the timer runs out.",
      subjectPreset: "ict-systems",
      timerSeconds: 5,
      difficulty: "medium",
      completionRule: "all-scenarios-complete",
      minimumScore: 300,
      scenariosText: createDefaultScenariosText()
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Title", type: "text", section: "Basic Settings" },
        { key: "instructions", label: "Instructions", type: "textarea", section: "Basic Settings" },
        { key: "subjectPreset", label: "Subject Preset", type: "select", options: listScenarioSimulatorPresetOptions(), section: "Scenario Preset" },
        { key: "difficulty", label: "Difficulty", type: "select", options: difficultyOptions(), section: "Timer" },
        { key: "timerSeconds", label: "Timer Seconds", type: "number", section: "Timer", help: "Used when Difficulty is Custom." },
        { key: "completionRule", label: "Completion Rule", type: "select", options: completionRuleOptions(), section: "Completion" },
        { key: "minimumScore", label: "Minimum Score", type: "number", section: "Completion", help: "Reserved for minimum-score completion." },
        { key: "scenariosText", label: "Scenario List", type: "textarea", section: "Scenarios", help: "Separate scenarios with ---. Use Title, Description, Prompt, Correct, Incorrect, Success, and Failure lines." }
      ]
    };
  }

  static createConfig(config) {
    return normalizeScenarioSimulatorConfig(super.createConfig(config));
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeConfig = this.createConfig(config);
    var complete = this.createCompletionGuard(callbacks && callbacks.onComplete);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    ScenarioSimulatorRenderer.attachPlayerHandlers(container, safeConfig, complete);
  }

  static renderPlayerShell(config) {
    return ScenarioSimulatorRenderer.renderPlayerShell(this, this.createConfig(config));
  }
}

function difficultyOptions() {
  return [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
    { value: "custom", label: "Custom" }
  ];
}

function completionRuleOptions() {
  return [
    { value: "all-scenarios-complete", label: "All Scenarios Complete" },
    { value: "minimum-score", label: "Minimum Score" },
    { value: "survival-mode", label: "Survival Mode" }
  ];
}
