import { getVocabularyDefaultContent } from "../../vocabulary.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "vocabulary-example-builder";
const TEMPLATE_PATCH = {
  word: "Variable",
  translation: "A named place to store information",
  exampleSentence: "A score variable can change during a game."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Vocabulary",
  title: "Example Builder",
  layout: "field-lab",
  interaction: "choice",
  accent: "#0891b2",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getVocabularyDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
