import { BaseStep } from "./BaseStep.js?v=1.1.79-user-command-center";

export class ReflectionStep extends BaseStep {
  static get type() {
    return "reflection";
  }

  static get label() {
    return "Reflection";
  }

  static get description() {
    return "A confidence reflection shell.";
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
      question: "",
      responseType: "scale",
      minWords: 0
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "question",
          label: "Question",
          type: "textarea"
        },
        {
          key: "responseType",
          label: "Response Type",
          type: "select",
          options: [
            {
              value: "scale",
              label: "Scale"
            },
            {
              value: "shortText",
              label: "Short Text"
            },
            {
              value: "longText",
              label: "Long Text"
            }
          ]
        },
        {
          key: "minWords",
          label: "Minimum Words",
          type: "number"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var question = this.readText(config, "question", "How confident do you feel?");
    var responseType = this.readText(config, "responseType", "scale");
    var minWords = this.readNumber(config, "minWords", 0);
    var html = "";

    html += '<article class="oqu-player-step oqu-player-reflection">';
    html += '<h2>Reflection</h2>';
    html += '<p>' + this.escapeHtml(question) + '</p>';
    if (responseType === "scale") {
      html += '<div class="oqu-player-scale"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>';
    } else {
      html += '<textarea class="oqu-player-text-response" placeholder="Write your reflection"></textarea>';
    }
    if (minWords > 0) {
      html += '<div class="oqu-player-note">Minimum words: ' + minWords + '</div>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
