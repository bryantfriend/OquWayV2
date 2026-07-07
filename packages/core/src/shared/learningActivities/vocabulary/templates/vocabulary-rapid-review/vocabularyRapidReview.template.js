import { getVocabularyDefaultContent } from "../../vocabulary.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "vocabulary-rapid-review";
const TEMPLATE_PATCH = {
  word: "Debug",
  translation: "Find and fix a problem",
  exampleSentence: "We debug the code after a test fails."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Vocabulary",
  title: "Rapid Review",
  layout: "skill-sprint",
  interaction: "choice",
  accent: "#16a34a",
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
