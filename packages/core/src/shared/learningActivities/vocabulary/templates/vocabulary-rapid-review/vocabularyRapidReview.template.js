import { getVocabularyDefaultContent } from "../../vocabulary.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "vocabulary-rapid-review";
const TEMPLATE_PATCH = {
  "word": "Input",
  "translation": "Data entered into a computer",
  "exampleSentence": "A keyboard sends input to the computer."
};
const TEMPLATE_OPTIONS = {
  "title": "Rapid Review",
  "archetype": "boss-battle",
  "eyebrow": "Vocabulary",
  "accent": "#dc2626",
  "bossName": "Memory Timer"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getVocabularyDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
