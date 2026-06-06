import { BaseStep } from "./BaseStep.js?v=1.1.109-student-assignment-status-fallback";

export class TextBriefingStep extends BaseStep {
  static get type() {
    return "textBriefing";
  }

  static get label() {
    return "Text Briefing";
  }

  static get description() {
    return "A short reading or explanation step.";
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
      heading: "",
      bodyText: "",
      calloutText: "",
      imageUrl: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "heading",
          label: "Heading",
          type: "text"
        },
        {
          key: "bodyText",
          label: "Body Text",
          type: "textarea"
        },
        {
          key: "calloutText",
          label: "Callout Text",
          type: "textarea"
        },
        {
          key: "imageUrl",
          label: "Image URL",
          type: "text"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var heading = this.readText(config, "heading", "Briefing");
    var bodyText = this.readText(config, "bodyText", "");
    var calloutText = this.readText(config, "calloutText", "");
    var imageUrl = this.readText(config, "imageUrl", "");
    var html = "";

    html += '<article class="oqu-player-step oqu-player-text-briefing">';
    if (imageUrl) {
      html += '<img class="oqu-player-image" src="' + this.escapeHtml(imageUrl) + '" alt="">';
    }
    html += '<h2>' + this.escapeHtml(heading) + '</h2>';
    if (bodyText) {
      html += '<p>' + this.escapeHtml(bodyText) + '</p>';
    }
    if (calloutText) {
      html += '<div class="oqu-player-callout">' + this.escapeHtml(calloutText) + '</div>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete</button>';
    html += '</article>';

    return html;
  }
}
