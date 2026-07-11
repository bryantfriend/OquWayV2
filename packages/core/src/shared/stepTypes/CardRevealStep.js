import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import {
  destroyCardRevealActivity,
  getCardRevealDefaultContent,
  getCardRevealPreviewContent,
  renderCardRevealActivity
} from "../learningActivities/card-reveal/cardReveal.activity.js?v=1.1.228-learning-activity-drag-interactions";
import { cardRevealSchema, normalizeCardRevealConfig } from "../learningActivities/card-reveal/cardReveal.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { cardRevealActivityDefinition } from "../learningActivities/card-reveal/cardReveal.registry.js?v=1.1.228-learning-activity-drag-interactions";

export class CardRevealStep extends BaseStep {
  static get type() {
    return "cardReveal";
  }

  static get label() {
    return "Card Reveal";
  }

  static get description() {
    return "A template-backed reveal activity where the base engine owns validation, events, and completion.";
  }

  static get category() {
    return "Interactive";
  }

  static get complexity() {
    return "Easy";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "interaction";
  }

  static get defaultConfig() {
    return getCardRevealDefaultContent();
  }

  static get editorSchema() {
    return cardRevealSchema;
  }

  static get activityDefinition() {
    return cardRevealActivityDefinition;
  }

  static createConfig(config) {
    return normalizeCardRevealConfig(config);
  }

  static renderPlayer(container, config, callbacks) {
    if (!container) {
      return;
    }

    destroyCardRevealActivity(container.__oquCardRevealContext);
    container.__oquCardRevealContext = renderCardRevealActivity(container, this.createConfig(config), callbacks);
  }

  static renderPlayerShell(config) {
    var safeConfig = this.createConfig(config);
    var previewConfig = Object.assign({}, getCardRevealPreviewContent(safeConfig.templateId), safeConfig);
    var previewId = "card-reveal-shell-" + Math.random().toString(36).slice(2);

    setTimeout(function () {
      var target = typeof document !== "undefined" ? document.getElementById(previewId) : null;
      if (target) {
        renderCardRevealActivity(target, previewConfig, {});
      }
    }, 0);

    return '<div id="' + previewId + '" class="oqu-card-reveal-shell-preview">'
      + '<article class="rounded-lg border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">'
      + '<strong>' + this.escapeHtml(safeConfig.title || "Card Reveal") + '</strong>'
      + '<p class="mt-1">Loading ' + this.escapeHtml(safeConfig.templateId || "card reveal") + ' preview...</p>'
      + '</article></div>';
  }
}
