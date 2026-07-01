import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.85-visual-helpers-syntax";

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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-player-reflection oqu-enhanced-card oqu-anim-float" style="max-width: 600px; margin: 0 auto; padding: 32px; animation-duration: 5s;">';
    
    html += '<div style="text-align: center; margin-bottom: 32px;">';
    html += '<div style="display: inline-block; background: var(--soft-purple); color: var(--purple); padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; margin-bottom: 16px;">Reflection</div>';
    html += '<h2 style="font-size: 1.5rem; color: var(--ink); line-height: 1.4; margin: 0;">' + this.escapeHtml(question) + '</h2>';
    html += '</div>';

    if (responseType === "scale") {
      html += '<div class="oqu-player-scale" style="display: flex; justify-content: space-between; gap: 8px; margin-bottom: 32px; background: var(--bg-color); padding: 16px; border-radius: 16px; border: 1px solid var(--line);">';
      for (let i = 1; i <= 5; i++) {
        html += '<span style="flex: 1; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; background: white; border: 2px solid var(--line); border-radius: 50%; font-weight: 700; color: var(--muted); cursor: pointer; transition: all 0.2s; font-size: 1.2rem;">' + i + '</span>';
      }
      html += '</div>';
    } else {
      let height = responseType === "longText" ? "150px" : "80px";
      html += '<textarea class="oqu-player-text-response" placeholder="Write your reflection here..." style="width: 100%; height: ' + height + '; padding: 16px; border-radius: 12px; border: 2px solid var(--line); margin-bottom: 16px; font-family: inherit; font-size: 1rem; color: var(--ink); resize: vertical; transition: border-color 0.2s; box-sizing: border-box;"></textarea>';
    }

    if (minWords > 0) {
      html += '<div class="oqu-player-note" style="text-align: right; font-size: 0.85rem; color: var(--muted); margin-bottom: 24px;">Minimum words: ' + minWords + '</div>';
    } else if (responseType !== "scale") {
      html += '<div style="height: 24px;"></div>'; // Spacer
    }
    
    html += '<button type="button" class="oqu-player-complete-btn" style="width: 100%; background: var(--blue); color: white; border: none; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: background 0.2s, transform 0.2s;">Complete</button>';
    html += '</article>';
    
    // Add simple hover effect for scale items
    if (responseType === "scale") {
      html += `
        <style>
          .oqu-player-scale span:hover {
            border-color: var(--blue) !important;
            color: var(--blue) !important;
            transform: scale(1.1);
          }
        </style>
      `;
    }

    return html;
  }
}
