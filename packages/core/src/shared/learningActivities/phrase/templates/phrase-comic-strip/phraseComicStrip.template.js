import { getPhraseDefaultContent } from "../../phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "phrase-comic-strip";
const TEMPLATE_PATCH = {
  "phrase": "Could you help me?",
  "meaning": "Ask politely for support.",
  "usageExample": "First I try. Then I ask: Could you help me?"
};
const TEMPLATE_OPTIONS = {
  "title": "Comic Strip",
  "archetype": "timeline-unlock",
  "eyebrow": "Phrase",
  "accent": "#ea580c"
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
