import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgFlashcardIcon } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.83-student-assignment-load";

export class VocabularyStep extends BaseStep {
  static get type() {
    return "vocabulary";
  }

  static get label() {
    return "Vocabulary";
  }

  static get description() {
    return "A vocabulary review shell.";
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
      word: "",
      translation: "",
      exampleSentence: "",
      imageUrl: "",
      audioUrl: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "word",
          label: "Word",
          type: "text"
        },
        {
          key: "translation",
          label: "Translation",
          type: "text"
        },
        {
          key: "exampleSentence",
          label: "Example Sentence",
          type: "textarea"
        },
        {
          key: "imageUrl",
          label: "Image URL",
          type: "text"
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
    var word = this.readText(config, "word", "Vocabulary word");
    var translation = this.readText(config, "translation", "");
    var exampleSentence = this.readText(config, "exampleSentence", "");
    var imageUrl = this.readText(config, "imageUrl", "");
    var audioUrl = this.readText(config, "audioUrl", "");
    var html = "";

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-player-flip-card group" style="perspective: 1000px; max-width: 480px; margin: 0 auto; width: 100%; height: 400px;">';
    html += '<div class="oqu-flip-card-inner oqu-anim-float" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d; cursor: pointer;">';

    // Front
    html += '<div class="oqu-flip-card-front oqu-enhanced-card" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center;">';
    if (imageUrl) {
      html += '<div class="oqu-flip-image-wrapper" style="margin-bottom: 24px; width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid var(--soft-blue);"><img class="oqu-flip-image" src="' + this.escapeHtml(imageUrl) + '" alt="" style="width: 100%; height: 100%; object-fit: cover;"></div>';
    } else {
      html += '<div class="oqu-icon-badge" style="transform: scale(1.5); margin-bottom: 32px;">' + buildSvgFlashcardIcon() + '</div>';
    }
    html += '<h2 class="oqu-flip-word" style="font-size: 2rem; font-weight: 800; color: var(--ink); margin-bottom: 16px;">' + this.escapeHtml(word) + '</h2>';
    html += '<div class="oqu-flip-hint" style="color: var(--muted); font-size: 0.9rem; background: var(--bg-color); padding: 8px 16px; border-radius: 20px;">Click to flip <i class="fa-solid fa-rotate-right ml-1"></i></div>';
    html += '</div>';

    // Back
    html += '<div class="oqu-flip-card-back oqu-enhanced-card" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction: column; background: var(--soft-blue); border-color: var(--blue);">';
    html += '<div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">';
    if (translation) {
      html += '<div class="oqu-flip-translation" style="font-size: 1.5rem; font-weight: 700; color: var(--blue); margin-bottom: 16px;">' + this.escapeHtml(translation) + '</div>';
    }
    if (exampleSentence) {
      html += '<p class="oqu-flip-example" style="font-size: 1.1rem; color: var(--ink); font-style: italic; background: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">"' + this.escapeHtml(exampleSentence) + '"</p>';
    }
    if (audioUrl) {
      html += '<audio class="oqu-player-audio mt-auto w-full" controls src="' + this.escapeHtml(audioUrl) + '" style="width: 100%; margin-bottom: 16px;"></audio>';
    }
    html += '</div>';
    html += '<button type="button" class="oqu-player-complete-btn oqu-flip-btn w-full mt-4" style="background: var(--blue); color: white; padding: 12px; border-radius: 8px; font-weight: bold; border: none; cursor: pointer; transition: transform 0.2s;">Got it</button>';
    html += '</div>';

    html += '</div>';
    html += '</article>';
    
    // Add simple inline script to handle flip without breaking existing listeners if possible.
    // Actually the platform probably already has flip logic for "oqu-player-flip-card group" but it was relying on group hover?
    // Wait, let's just make it flip on hover via CSS for safety, or assume the parent container handles it.
    html += `
      <style>
        .oqu-player-flip-card:hover .oqu-flip-card-inner {
          transform: rotateY(180deg);
        }
      </style>
    `;

    return html;
  }
}

