import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgSparkles } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.85-visual-helpers-syntax";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-custom-experience-step" style="position: relative; overflow: hidden; max-width: 800px; margin: 0 auto; background: var(--bg-color); border-radius: 24px; padding: 40px; border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,0.05);">';
    
    // Add sparkles background
    html += buildSvgSparkles();
    
    html += '<div class="oqu-interactive-content">';
    html += '<div class="oqu-experience-kicker" style="display: inline-block; background: var(--ink); color: white; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px;">Custom · ' + this.escapeHtml(theme) + '</div>';
    
    html += '<div class="oqu-experience-hero" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; margin-bottom: 40px;">';
    html += '<div style="flex: 1;">';
    html += '<h2 style="font-size: 2.5rem; font-weight: 800; color: var(--ink); line-height: 1.2; margin-bottom: 16px;">' + this.escapeHtml(title) + '</h2>';
    html += '<p style="font-size: 1.2rem; color: var(--muted); line-height: 1.6;">' + this.escapeHtml(instructions) + '</p>';
    html += '</div>';
    html += '<div class="oqu-experience-orb oqu-anim-pulse" style="width: 64px; height: 64px; background: linear-gradient(135deg, #a855f7, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); flex-shrink: 0;">✦</div>';
    html += '</div>';
    
    html += '<div class="oqu-custom-experience-panel" style="background: white; border: 2px dashed var(--line); border-radius: 16px; padding: 24px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between;">';
    html += '<strong style="color: var(--ink); font-size: 1.1rem;">Experience Module Active</strong>';
    html += '<span style="background: var(--soft-blue); color: var(--blue); padding: 8px 16px; border-radius: 8px; font-family: monospace; font-weight: bold;">' + this.escapeHtml(experienceType) + '</span>';
    html += '</div>';
    
    if (data) {
      html += '<pre class="oqu-experience-code" style="background: #1e293b; color: #e2e8f0; padding: 24px; border-radius: 12px; font-family: monospace; font-size: 0.9rem; overflow-x: auto; margin-bottom: 32px; border-left: 4px solid #6366f1;">' + this.escapeHtml(data) + '</pre>';
    }
    
    html += '<button type="button" class="oqu-player-complete-btn" style="background: var(--ink); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s; width: 100%;">Initialize Complete</button>';
    html += '</div>';
    html += '</article>';

    return html;
  }
}
