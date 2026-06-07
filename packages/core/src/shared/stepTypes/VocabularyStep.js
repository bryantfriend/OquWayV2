import { BaseStep } from "./BaseStep.js?v=1.1.120-student-course-debug-summary";

export class VocabularyStep extends BaseStep {
  static get type() {
    return "vocabulary";
  }

  static get label() {
    return "Vocabulary";
  }

  static get description() {
    return "A vocabulary review shell.";
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
      word: "",
      translation: "",
      exampleSentence: "",
      imageUrl: "",
      audioUrl: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "word",
          label: "Word",
          type: "text"
        },
        {
          key: "translation",
          label: "Translation",
          type: "text"
        },
        {
          key: "exampleSentence",
          label: "Example Sentence",
          type: "textarea"
        },
        {
          key: "imageUrl",
          label: "Image URL",
          type: "text"
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
    var word = this.readText(config, "word", "Vocabulary word");
    var translation = this.readText(config, "translation", "");
    var exampleSentence = this.readText(config, "exampleSentence", "");
    var imageUrl = this.readText(config, "imageUrl", "");
    var audioUrl = this.readText(config, "audioUrl", "");
    var html = "";

    html += '<article class="oqu-player-step oqu-player-vocabulary">';
    if (imageUrl) {
      html += '<img class="oqu-player-image" src="' + this.escapeHtml(imageUrl) + '" alt="">';
    }
    html += '<h2>' + this.escapeHtml(word) + '</h2>';
    if (translation) {
      html += '<div class="oqu-player-translation">' + this.escapeHtml(translation) + '</div>';
    }
    if (audioUrl) {
      html += '<audio class="oqu-player-audio" controls src="' + this.escapeHtml(audioUrl) + '"></audio>';
    }
    if (exampleSentence) {
      html += '<p>' + this.escapeHtml(exampleSentence) + '</p>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
