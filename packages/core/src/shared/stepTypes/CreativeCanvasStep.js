import { BaseStep } from "./BaseStep.js?v=1.1.192-timed-sequence";
import { CreativeCanvasRenderer } from "./creativeCanvas/CreativeCanvasRenderer.js?v=1.1.192-timed-sequence";
import { listCreativeCanvasPresetOptions } from "./creativeCanvas/creativeCanvasPresets.js?v=1.1.192-timed-sequence";

export class CreativeCanvasStep extends BaseStep {
  static get type() {
    return "creative-canvas";
  }

  static get label() {
    return "Creative Canvas";
  }

  static get description() {
    return "Students draw, design, label, diagram, or visually respond to a prompt.";
  }

  static get category() {
    return "Creative / Practice";
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
      title: "Create Your ICT World",
      prompt: "Draw or design examples of digital technology you see around you.",
      instructions: "Use the canvas tools to create a picture showing ICT in everyday life.",
      subjectPreset: "ict-design",
      canvasBackground: "blank-dark",
      requiredTools: "brush,eraser,fill,stamp,spray",
      stampPack: "ict",
      completionRule: "submit-canvas",
      minimumTimeSeconds: 20,
      allowBrush: "true",
      allowSpray: "true",
      allowFill: "true",
      allowStamps: "true",
      allowLabels: "false",
      allowUndo: "true",
      allowClear: "true"
    };
  }

  static get editorSchema() {
    return {
      fields: [
        { key: "title", label: "Title", type: "text", section: "Basic Settings" },
        { key: "prompt", label: "Prompt", type: "textarea", section: "Basic Settings" },
        { key: "instructions", label: "Instructions", type: "textarea", section: "Basic Settings" },
        { key: "subjectPreset", label: "Subject Preset", type: "select", options: listCreativeCanvasPresetOptions(), section: "Canvas Settings" },
        { key: "canvasBackground", label: "Canvas Background", type: "select", options: canvasBackgroundOptions(), section: "Canvas Settings" },
        { key: "requiredTools", label: "Required Tools", type: "textarea", section: "Tools", help: "Use comma or line separated tool IDs: brush, square-brush, spray, fill, eraser, stamp, label." },
        { key: "allowBrush", label: "Allow Brush", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowSpray", label: "Allow Spray", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowFill", label: "Allow Fill", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowStamps", label: "Allow Stamps", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowLabels", label: "Allow Labels", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowUndo", label: "Allow Undo", type: "select", options: boolOptions(), section: "Tools" },
        { key: "allowClear", label: "Allow Clear", type: "select", options: boolOptions(), section: "Tools" },
        { key: "stampPack", label: "Stamp Pack", type: "select", options: stampPackOptions(), section: "Stamp Pack" },
        { key: "completionRule", label: "Completion Rule", type: "select", options: completionRuleOptions(), section: "Completion Rule" },
        { key: "minimumTimeSeconds", label: "Minimum Time Seconds", type: "number", section: "Completion Rule" }
      ]
    };
  }

  static renderPlayer(container, config, callbacks) {
    this.assertRenderArgs({ container: container });
    var safeConfig = this.createConfig(config);
    var complete = this.createCompletionGuard(callbacks && callbacks.onComplete);

    container.innerHTML = this.renderPlayerShell(safeConfig);
    CreativeCanvasRenderer.attachPlayerHandlers(container, safeConfig, complete);
  }

  static renderPlayerShell(config) {
    return CreativeCanvasRenderer.renderPlayerShell(this, this.createConfig(config));
  }
}

function boolOptions() {
  return [
    { value: "true", label: "True" },
    { value: "false", label: "False" }
  ];
}

function canvasBackgroundOptions() {
  return [
    { value: "blank-dark", label: "Blank Dark" },
    { value: "blank-light", label: "Blank Light" },
    { value: "grid-light", label: "Grid Light" },
    { value: "paper", label: "Paper" }
  ];
}

function stampPackOptions() {
  return [
    { value: "ict", label: "ICT" },
    { value: "science", label: "Science" },
    { value: "math", label: "Math" },
    { value: "english", label: "English" },
    { value: "history", label: "History" }
  ];
}

function completionRuleOptions() {
  return [
    { value: "submit-canvas", label: "Submit Canvas" },
    { value: "minimum-time", label: "Minimum Time" },
    { value: "teacher-review", label: "Teacher Review" }
  ];
}
