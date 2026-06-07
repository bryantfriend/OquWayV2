import { BaseStep } from "./BaseStep.js?v=1.1.118-fruit-login-student-identity";

export class CustomExperienceStep extends BaseStep {
  static get type() {
    return "customExperience";
  }

  static get label() {
    return "Custom Experience";
  }

  static get description() {
    return "A flexible wrapper for future mini-app templates.";
  }

  static get category() {
    return "Custom";
  }

  static get complexity() {
    return "Medium";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {
      experienceType: "",
      title: "",
      theme: "",
      instructions: "",
      data: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "experienceType",
          label: "Experience Type",
          type: "text"
        },
        {
          key: "title",
          label: "Title",
          type: "text"
        },
        {
          key: "theme",
          label: "Theme",
          type: "text"
        },
        {
          key: "instructions",
          label: "Instructions",
          type: "textarea"
        },
        {
          key: "data",
          label: "Data",
          type: "textarea"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var experienceType = this.readText(config, "experienceType", "future-mini-app");
    var title = this.readText(config, "title", "Custom Experience");
    var theme = this.readText(config, "theme", "studio");
    var instructions = this.readText(config, "instructions", "This custom experience shell is ready for a future template.");
    var data = this.readText(config, "data", "");
    var html = "";

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-custom-experience-step">';
    html += '<div class="oqu-experience-kicker">Custom · ' + this.escapeHtml(theme) + '</div>';
    html += '<div class="oqu-experience-hero">';
    html += '<div>';
    html += '<h2>' + this.escapeHtml(title) + '</h2>';
    html += '<p>' + this.escapeHtml(instructions) + '</p>';
    html += '</div>';
    html += '<div class="oqu-experience-orb">✦</div>';
    html += '</div>';
    html += '<div class="oqu-custom-experience-panel">';
    html += '<strong>Custom experience selected:</strong>';
    html += '<span>' + this.escapeHtml(experienceType) + '</span>';
    html += '</div>';
    if (data) {
      html += '<pre class="oqu-experience-code">' + this.escapeHtml(data) + '</pre>';
    }
    html += '<button type="button" class="oqu-player-complete-btn">Complete Experience</button>';
    html += '</article>';

    return html;
  }
}
