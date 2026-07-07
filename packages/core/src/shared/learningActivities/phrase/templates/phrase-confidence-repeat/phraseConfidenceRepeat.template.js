import { getPhraseDefaultContent } from "../../phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "phrase-confidence-repeat";
const TEMPLATE_PATCH = {
  phrase: "Let me try again.",
  meaning: "A growth mindset phrase.",
  usageExample: "Let me try again after I fix the mistake."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Phrase",
  title: "Confidence Repeat",
  layout: "skill-sprint",
  interaction: "media",
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
  return mergeTemplateContent(TEMPLATE_ID, getPhraseDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
