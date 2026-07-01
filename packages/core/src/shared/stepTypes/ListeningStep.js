import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgHeadphones } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.85-visual-helpers-syntax";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-player-listening oqu-enhanced-card" style="max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: center;">';
    
    html += '<div class="oqu-icon-badge oqu-anim-pulse" style="width: 80px; height: 80px; border-radius: 50%; font-size: 2rem; margin-bottom: 24px;">' + buildSvgHeadphones() + '</div>';
    
    html += '<h2 style="font-size: 1.5rem; font-weight: 700; color: var(--ink); margin-bottom: 12px;">Listening Challenge</h2>';
    html += '<p style="color: var(--muted); font-size: 1.1rem; line-height: 1.5; margin-bottom: 32px;">' + this.escapeHtml(questionPrompt) + '</p>';
    
    if (audioUrl) {
      html += '<div style="width: 100%; background: var(--soft-blue); padding: 16px; border-radius: 12px; margin-bottom: 24px;">';
      html += '<audio class="oqu-player-audio" controls src="' + this.escapeHtml(audioUrl) + '" style="width: 100%;"></audio>';
      html += '</div>';
    } else {
      html += '<div class="oqu-player-empty-media" style="width: 100%; background: #f1f5f9; padding: 24px; border-radius: 12px; border: 2px dashed #cbd5e1; color: #64748b; margin-bottom: 24px;">No audio uploaded yet.</div>';
    }
    
    if (transcript) {
      html += '<details class="oqu-player-details" style="width: 100%; text-align: left; background: var(--bg-color); border: 1px solid var(--line); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">';
      html += '<summary style="padding: 12px 16px; font-weight: 600; color: var(--blue); cursor: pointer; background: white; user-select: none;">Transcript</summary>';
      html += '<p style="padding: 16px; margin: 0; color: var(--ink); font-size: 0.95rem; line-height: 1.6; border-top: 1px solid var(--line);">' + this.escapeHtml(transcript) + '</p>';
      html += '</details>';
    }
    
    html += '<button type="button" class="oqu-player-complete-btn" style="width: 100%; background: var(--blue); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s;">Complete</button>';
    html += '</article>';

    return html;
  }
}
