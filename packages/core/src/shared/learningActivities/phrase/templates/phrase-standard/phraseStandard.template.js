import { getPhraseDefaultContent } from "../../phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "phrase-standard";
const TEMPLATE_PATCH = {
  "phrase": "Can you explain that?",
  "meaning": "Ask someone to say more clearly what they mean.",
  "usageExample": "Can you explain that? I want to understand your idea."
};
const TEMPLATE_OPTIONS = {
  "title": "Phrase Card",
  "archetype": "card-stack",
  "eyebrow": "Phrase",
  "accent": "#2563eb"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getPhraseDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
