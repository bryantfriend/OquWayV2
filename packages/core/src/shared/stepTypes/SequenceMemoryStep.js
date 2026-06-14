import { BaseStep } from "./BaseStep.js?v=1.1.192-timed-sequence";
import { SequenceMemoryRenderer } from "./sequenceMemory/SequenceMemoryRenderer.js?v=1.1.192-timed-sequence";
import {
  createDefaultSequencePadsText,
  normalizeSequenceMemoryConfig
} from "./sequenceMemory/sequenceMemoryConfig.js?v=1.1.192-timed-sequence";
import { listSequenceMemoryThemeOptions } from "./sequenceMemory/sequencePresetLibrary.js?v=1.1.192-timed-sequence";

export class SequenceMemoryStep extends BaseStep {
  static get type() {
    return "sequence-memory";
  }

  static get label() {
    return "Sequence Memory";
  }

  static get description() {
    return "Students watch a pattern, then repeat it correctly.";
  }

  static get category() {
    return "Memory / Pattern";
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
      title: "Synth Matrix",
      instructions: "Watch the pattern, then repeat it using the pads.",
      subjectTheme: "synth-matrix",
      gridSize: 9,
      startingSequenceLength: 3,
      maximumSequenceLength: 8,
      soundEnabled: true,
      timerEnabled: false,
      completionRule: "reach-max-sequence",
      padsText: createDefaultSequencePadsText()
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Title", type: "text", section: "Basic Settings" },
        { key: "instructions", label: "Instructions", type: "textarea", section: "Basic Settings" },
        { key: "subjectTheme", label: "Subject Theme Preset", type: "select", options: listSequenceMemoryThemeOptions(), section: "Theme" },
        { key: "gridSize", label: "Grid Size", type: "select", options: gridSizeOptions(), section: "Game Rules" },
        { key: "startingSequenceLength", label: "Starting Sequence Length", type: "number", section: "Game Rules" },
        { key: "maximumSequenceLength", label: "Maximum Sequence Length", type: "number", section: "Game Rules" },
        { key: "soundEnabled", label: "Sound Enabled", type: "select", options: boolOptions(), section: "Game Rules" },
        { key: "timerEnabled", label: "Timer Enabled", type: "select", options: boolOptions(), section: "Game Rules", help: "Shows elapsed activity time while students play." },
        { key: "completionRule", label: "Completion Rule", type: "select", options: completionRuleOptions(), section: "Completion" },
        { key: "padsText", label: "Custom Pads", type: "textarea", section: "Pads", help: "Optional. One pad per line: Label|Icon|Frequency. Leave blank to use the selected preset." }
      ]
    };
  }

  static createConfig(config) {
    return normalizeSequenceMemoryConfig(super.createConfig(config));
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeConfig = this.createConfig(config);
    var complete = this.createCompletionGuard(callbacks && callbacks.onComplete);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    SequenceMemoryRenderer.attachPlayerHandlers(container, safeConfig, complete);
  }

  static renderPlayerShell(config) {
    return SequenceMemoryRenderer.renderPlayerShell(this, this.createConfig(config));
  }
}

function gridSizeOptions() {
  return [
    { value: "4", label: "2 x 2" },
    { value: "9", label: "3 x 3" },
    { value: "16", label: "4 x 4" }
  ];
}

function boolOptions() {
  return [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ];
}

function completionRuleOptions() {
  return [
    { value: "reach-max-sequence", label: "Reach Max Sequence" },
    { value: "complete-levels", label: "Complete Levels" },
    { value: "practice-only", label: "Practice Only" }
  ];
}
