import { BaseStep } from "./BaseStep.js?v=1.1.107-student-firebase-auth-chain";

export class ListeningStep extends BaseStep {
  static get type() {
    return "listening";
  }

  static get label() {
    return "Listening";
  }

  static get description() {
    return "A listening challenge shell.";
  }

  static get category() {
    return "Media";
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
      audioUrl: "",
      transcript: "",
      questionPrompt: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "audioUrl",
          label: "Audio URL",
          type: "text"
        },
        {
          key: "transcript",
          label: "Transcript",
          type: "textarea"
        },
        {
          key: "questionPrompt",
          label: "Question Prompt",
          type: "textarea"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var audioUrl = this.readText(config, "audioUrl", "");
    var transcript = this.readText(config, "transcript", "");
    var questionPrompt = this.readText(config, "questionPrompt", "Listen and answer the question.");
    var html = "";

    html += '<article class="oqu-player-step oqu-player-listening">';
    html += '<h2>Listening Challenge</h2>';
    html += '<p>' + this.escapeHtml(questionPrompt) + '</p>';
    if (audioUrl) {
      html += '<audio class="oqu-player-audio" controls src="' + this.escapeHtml(audioUrl) + '"></audio>';
    } else {
      html += '<div class="oqu-player-empty-media">No audio uploaded yet.</div>';
    }
    if (transcript) {
      html += '<details class="oqu-player-details"><summary>Transcript</summary><p>' + this.escapeHtml(transcript) + '</p></details>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
