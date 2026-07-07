import { getPhraseDefaultContent } from "../../phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "phrase-standard";
const TEMPLATE_PATCH = {
  phrase: "Can you help me?",
  meaning: "A polite request for support.",
  usageExample: "Can you help me check this answer?"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Phrase",
  title: "Phrase Card",
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
  return mergeTemplateContent(TEMPLATE_ID, getPhraseDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
