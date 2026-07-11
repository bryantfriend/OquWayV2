import { getVocabularyDefaultContent } from "../../vocabulary.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "vocabulary-example-builder";
const TEMPLATE_PATCH = {
  "word": "Variable",
  "translation": "A named place to store information",
  "exampleSentence": "A score variable can change during a game."
};
const TEMPLATE_OPTIONS = {
  "title": "Example Builder",
  "archetype": "builder-workbench",
  "eyebrow": "Vocabulary",
  "accent": "#0891b2"
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
