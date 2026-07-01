import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgSpeechBubble } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.83-student-assignment-load";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-player-phrase oqu-enhanced-card oqu-anim-float" style="max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: stretch; animation-duration: 4s;">';
    
    html += '<div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px;">';
    html += '<div class="oqu-icon-badge" style="flex-shrink: 0; background: var(--soft-coral); color: var(--coral); border-radius: 50%;">' + buildSvgSpeechBubble() + '</div>';
    html += '<div>';
    html += '<h2 style="font-size: 1.75rem; font-weight: 800; color: var(--ink); line-height: 1.2; margin-bottom: 8px;">"' + this.escapeHtml(phrase) + '"</h2>';
    if (meaning) {
      html += '<div class="oqu-player-translation" style="font-size: 1.1rem; color: var(--muted); font-weight: 500;">' + this.escapeHtml(meaning) + '</div>';
    }
    html += '</div>';
    html += '</div>';

    if (usageExample) {
      html += '<div style="background: var(--soft-coral); padding: 16px; border-radius: 12px; margin-bottom: 24px;">';
      html += '<p style="color: var(--ink); font-style: italic; margin: 0;">Example: ' + this.escapeHtml(usageExample) + '</p>';
      html += '</div>';
    }

    if (audioUrl) {
      html += '<div style="background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--line);">';
      html += '<audio class="oqu-player-audio" controls src="' + this.escapeHtml(audioUrl) + '" style="width: 100%; height: 36px;"></audio>';
      html += '</div>';
    }

    html += '<button type="button" class="oqu-player-complete-btn" style="background: var(--blue); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.2s;">Got it</button>';
    html += '</article>';

    return html;
  }
}
