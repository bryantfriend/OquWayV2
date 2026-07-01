import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgDocumentIcon, buildSvgSparkles } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.83-student-assignment-load";

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
    return "full";
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

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-player-hero-intro" style="position: relative; overflow: hidden; padding-bottom: 24px;">';
    html += buildSvgSparkles();
    
    html += '<div class="oqu-interactive-content" style="max-width: 600px; margin: 0 auto; width: 100%;">';
    
    if (imageUrl) {
      html += '<div class="oqu-hero-image-container" style="border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">';
      html += '<img class="oqu-hero-image" src="' + this.escapeHtml(imageUrl) + '" alt="" style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;">';
      html += '<div class="oqu-hero-overlay"></div>';
      html += '</div>';
    } else {
      html += '<div class="oqu-icon-badge oqu-anim-float">' + buildSvgDocumentIcon() + '</div>';
    }
    
    html += '<div class="oqu-hero-content oqu-enhanced-card" style="margin-top: -16px; position: relative; z-index: 10;">';
    html += '<h2 class="oqu-hero-title" style="margin-bottom: 16px;">' + this.escapeHtml(heading) + '</h2>';
    
    if (bodyText) {
      html += '<p class="oqu-hero-text" style="color: var(--muted); line-height: 1.6; margin-bottom: 24px;">' + this.escapeHtml(bodyText) + '</p>';
    }
    
    if (calloutText) {
      html += '<div class="oqu-hero-callout" style="background: var(--soft-blue); border-left: 4px solid var(--blue); padding: 16px; border-radius: 4px 8px 8px 4px; margin-bottom: 24px; color: var(--ink);">' + this.escapeHtml(calloutText) + '</div>';
    }
    
    html += '<div class="oqu-reading-progress"><div class="oqu-reading-progress-bar" style="width: 100%;"></div></div>';
    html += '<div style="margin-top: 24px; text-align: center;">';
    html += '<button type="button" class="oqu-player-complete-btn oqu-hero-btn" style="padding: 12px 32px; border-radius: 24px; font-weight: bold; background: var(--blue); color: white; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Continue <i class="fa-solid fa-arrow-right ml-1"></i></button>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</article>';

    return html;
  }
}
