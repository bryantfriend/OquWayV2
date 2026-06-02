import { BaseStep } from "./BaseStep.js?v=1.1.29-module-render-fix";

export class SpeakingPromptStep extends BaseStep {
  static get type() {
    return "speakingPrompt";
  }

  static get label() {
    return "Speaking Prompt";
  }

  static get description() {
    return "A speaking prompt shell without recording.";
  }

  static get category() {
    return "Speaking";
  }

  static get complexity() {
    return "Easy";
  }

  static get previewMode() {
    return "card";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {
      prompt: "",
      preparationSeconds: 30,
      speakingSeconds: 60
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "prompt",
          label: "Prompt",
          type: "textarea"
        },
        {
          key: "preparationSeconds",
          label: "Preparation Seconds",
          type: "number"
        },
        {
          key: "speakingSeconds",
          label: "Speaking Seconds",
          type: "number"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var prompt = this.readText(config, "prompt", "Tell us your answer.");
    var preparationSeconds = this.readNumber(config, "preparationSeconds", 30);
    var speakingSeconds = this.readNumber(config, "speakingSeconds", 60);
    var html = "";

    html += '<article class="oqu-player-step oqu-player-speaking">';
    html += '<h2>Speaking Challenge</h2>';
    html += '<p>' + this.escapeHtml(prompt) + '</p>';
    html += '<div class="oqu-player-timer-row">';
    html += '<span>Prepare: ' + preparationSeconds + 's</span>';
    html += '<span>Speak: ' + speakingSeconds + 's</span>';
    html += '</div>';
    html += '<button type="button" class="oqu-player-record-shell">Recording Coming Soon</button>';
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
