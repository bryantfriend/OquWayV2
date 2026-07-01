import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgMicrophone } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.83-student-assignment-load";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-player-speaking oqu-enhanced-card" style="max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: center;">';
    
    html += '<div class="oqu-icon-badge oqu-anim-pulse" style="width: 80px; height: 80px; border-radius: 50%; font-size: 2rem; margin-bottom: 24px; background: var(--soft-coral); color: var(--coral);">' + buildSvgMicrophone() + '</div>';
    
    html += '<h2 style="font-size: 1.5rem; font-weight: 700; color: var(--ink); margin-bottom: 12px;">Speaking Challenge</h2>';
    html += '<p style="color: var(--muted); font-size: 1.1rem; line-height: 1.5; margin-bottom: 32px;">' + this.escapeHtml(prompt) + '</p>';
    
    html += '<div class="oqu-player-timer-row" style="display: flex; gap: 16px; width: 100%; margin-bottom: 24px;">';
    html += '<div style="flex: 1; background: var(--bg-color); padding: 16px; border-radius: 12px; border: 1px solid var(--line);">';
    html += '<div style="font-size: 0.85rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Prepare</div>';
    html += '<div style="font-size: 1.5rem; font-weight: 700; color: var(--ink);">' + preparationSeconds + 's</div>';
    html += '</div>';
    html += '<div style="flex: 1; background: var(--bg-color); padding: 16px; border-radius: 12px; border: 1px solid var(--line);">';
    html += '<div style="font-size: 0.85rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Speak</div>';
    html += '<div style="font-size: 1.5rem; font-weight: 700; color: var(--ink);">' + speakingSeconds + 's</div>';
    html += '</div>';
    html += '</div>';
    
    html += '<div class="oqu-player-record-shell" style="width: 100%; background: #f1f5f9; padding: 16px; border-radius: 12px; color: #64748b; font-weight: 500; border: 2px dashed #cbd5e1; margin-bottom: 24px;">Microphone Recording Coming Soon</div>';
    
    html += '<button type="button" class="oqu-player-complete-btn" style="width: 100%; background: var(--blue); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s;">Complete Practice</button>';
    html += '</article>';

    return html;
  }
}
