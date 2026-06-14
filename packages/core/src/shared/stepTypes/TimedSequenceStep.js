import { BaseStep } from "./BaseStep.js?v=1.1.192-timed-sequence";
import { TimedSequenceRenderer } from "./timedSequence/TimedSequenceRenderer.js?v=1.1.192-timed-sequence";
import {
  createDefaultTimedSequenceItemsText,
  normalizeTimedSequenceConfig
} from "./timedSequence/timedSequenceConfig.js?v=1.1.192-timed-sequence";
import { listTimedSequenceThemeOptions } from "./timedSequence/timedSequencePresetLibrary.js?v=1.1.192-timed-sequence";

export class TimedSequenceStep extends BaseStep {
  static get type() {
    return "timed-sequence";
  }

  static get label() {
    return "Timed Sequence Challenge";
  }

  static get description() {
    return "Students complete a required sequence in the correct order before time runs out.";
  }

  static get category() {
    return "Sequence / Challenge";
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
      title: "Defusal Sequence",
      instructions: "Complete the required sequence in order before time runs out.",
      subjectTheme: "system-defusal",
      startingTimeSeconds: 10,
      minimumTimeSeconds: 3,
      startingSequenceLength: 4,
      maximumSequenceLength: 8,
      difficultyIncrease: true,
      glitchesEnabled: true,
      completionRule: "complete-levels",
      requiredLevels: 5,
      targetScore: 1200,
      sequenceItemsText: createDefaultTimedSequenceItemsText()
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Title", type: "text", section: "Basic Settings" },
        { key: "instructions", label: "Instructions", type: "textarea", section: "Basic Settings" },
        { key: "subjectTheme", label: "Subject Theme Preset", type: "select", options: listTimedSequenceThemeOptions(), section: "Theme" },
        { key: "startingTimeSeconds", label: "Starting Time Seconds", type: "number", section: "Timer" },
        { key: "minimumTimeSeconds", label: "Minimum Time Seconds", type: "number", section: "Timer" },
        { key: "startingSequenceLength", label: "Starting Sequence Length", type: "number", section: "Sequence" },
        { key: "maximumSequenceLength", label: "Maximum Sequence Length", type: "number", section: "Sequence" },
        { key: "difficultyIncrease", label: "Difficulty Increase", type: "select", options: boolOptions(), section: "Difficulty" },
        { key: "glitchesEnabled", label: "Glitches Enabled", type: "select", options: boolOptions(), section: "Difficulty" },
        { key: "completionRule", label: "Completion Rule", type: "select", options: completionRuleOptions(), section: "Completion" },
        { key: "requiredLevels", label: "Required Levels", type: "number", section: "Completion" },
        { key: "targetScore", label: "Target Score", type: "number", section: "Completion", help: "Used when Completion Rule is Reach Score." },
        { key: "sequenceItemsText", label: "Sequence Items", type: "textarea", section: "Sequence Items", help: "One item per line: Label|Color. Example: RED|red." }
      ]
    };
  }

  static createConfig(config) {
    return normalizeTimedSequenceConfig(super.createConfig(config));
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeConfig = this.createConfig(config);
    var complete = this.createCompletionGuard(callbacks && callbacks.onComplete);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    TimedSequenceRenderer.attachPlayerHandlers(container, safeConfig, complete);
  }

  static renderPlayerShell(config) {
    return TimedSequenceRenderer.renderPlayerShell(this, this.createConfig(config));
  }
}

function boolOptions() {
  return [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ];
}

function completionRuleOptions() {
  return [
    { value: "complete-levels", label: "Complete Levels" },
    { value: "survive-time", label: "Survive Time" },
    { value: "reach-score", label: "Reach Score" }
  ];
}
