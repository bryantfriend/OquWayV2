import { BaseStep } from "./BaseStep.js?v=1.1.118-fruit-login-student-identity";

export class CyberCodeMissionStep extends BaseStep {
  static get type() {
    return "cyberCodeMission";
  }

  static get label() {
    return "Cyber Code Mission";
  }

  static get description() {
    return "A cyber-styled shell for coding and HTML missions.";
  }

  static get category() {
    return "Coding";
  }

  static get complexity() {
    return "Advanced";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {
      missionTitle: "",
      missionSubtitle: "",
      instructions: "",
      starterCode: "",
      successMessage: "",
      theme: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "missionTitle",
          label: "Mission Title",
          type: "text"
        },
        {
          key: "missionSubtitle",
          label: "Mission Subtitle",
          type: "text"
        },
        {
          key: "instructions",
          label: "Instructions",
          type: "textarea"
        },
        {
          key: "starterCode",
          label: "Starter Code",
          type: "textarea"
        },
        {
          key: "successMessage",
          label: "Success Message",
          type: "text"
        },
        {
          key: "theme",
          label: "Theme",
          type: "text"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var missionTitle = this.readText(config, "missionTitle", "Cyber Code Mission");
    var missionSubtitle = this.readText(config, "missionSubtitle", "Repair the HTML signal.");
    var instructions = this.readText(config, "instructions", "Read the mission, inspect the starter code, and complete the challenge.");
    var starterCode = this.readText(config, "starterCode", "<h1>Hello OquWay</h1>");
    var successMessage = this.readText(config, "successMessage", "Mission complete.");
    var theme = this.readText(config, "theme", "neon");
    var html = "";

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-cyber-mission-step">';
    html += '<div class="oqu-cyber-grid"></div>';
    html += '<div class="oqu-experience-kicker">Coding · ' + this.escapeHtml(theme) + '</div>';
    html += '<section class="oqu-cyber-mission-header">';
    html += '<div>';
    html += '<h2>' + this.escapeHtml(missionTitle) + '</h2>';
    html += '<p>' + this.escapeHtml(missionSubtitle) + '</p>';
    html += '</div>';
    html += '<span class="oqu-cyber-badge">Mission Shell</span>';
    html += '</section>';
    html += '<div class="oqu-cyber-layout">';
    html += '<div class="oqu-cyber-panel">';
    html += '<strong>Mission Panel</strong>';
    html += '<p>' + this.escapeHtml(instructions) + '</p>';
    html += '</div>';
    html += '<div class="oqu-cyber-code-area">';
    html += '<div class="oqu-cyber-window-label">starter.html</div>';
    html += '<pre>' + this.escapeHtml(starterCode) + '</pre>';
    html += '</div>';
    html += '<div class="oqu-cyber-preview-area">';
    html += '<div class="oqu-cyber-window-label">Live Preview</div>';
    html += '<div class="oqu-cyber-preview-box">Preview output placeholder</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="oqu-cyber-success">' + this.escapeHtml(successMessage) + '</div>';
    html += '<button type="button" class="oqu-player-complete-btn">Complete Mission</button>';
    html += '</article>';

    return html;
  }
}
