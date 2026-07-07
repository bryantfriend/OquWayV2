import { getVocabularyDefaultContent } from "../../vocabulary.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "vocabulary-standard";
const TEMPLATE_PATCH = {
  word: "Algorithm",
  translation: "A clear sequence of steps",
  exampleSentence: "We followed an algorithm to solve the problem."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Vocabulary",
  title: "Flip Word Card",
  layout: "studio-card",
  interaction: "media",
  accent: "#2563eb",
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
