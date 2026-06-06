import { BaseStep } from "./BaseStep.js?v=1.1.108-student-class-alias-merge";

export class PhraseStep extends BaseStep {
  static get type() {
    return "phrase";
  }

  static get label() {
    return "Phrase";
  }

  static get description() {
    return "A useful phrase practice shell.";
  }

  static get category() {
    return "Basic";
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
      phrase: "",
      meaning: "",
      usageExample: "",
      audioUrl: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "phrase",
          label: "Phrase",
          type: "text"
        },
        {
          key: "meaning",
          label: "Meaning",
          type: "text"
        },
        {
          key: "usageExample",
          label: "Usage Example",
          type: "textarea"
        },
        {
          key: "audioUrl",
          label: "Audio URL",
          type: "text"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var phrase = this.readText(config, "phrase", "Practice phrase");
    var meaning = this.readText(config, "meaning", "");
    var usageExample = this.readText(config, "usageExample", "");
    var audioUrl = this.readText(config, "audioUrl", "");
    var html = "";

    html += '<article class="oqu-player-step oqu-player-phrase">';
    html += '<h2>' + this.escapeHtml(phrase) + '</h2>';
    if (meaning) {
      html += '<div class="oqu-player-translation">' + this.escapeHtml(meaning) + '</div>';
    }
    if (audioUrl) {
      html += '<audio class="oqu-player-audio" controls src="' + this.escapeHtml(audioUrl) + '"></audio>';
    }
    if (usageExample) {
      html += '<p>' + this.escapeHtml(usageExample) + '</p>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
