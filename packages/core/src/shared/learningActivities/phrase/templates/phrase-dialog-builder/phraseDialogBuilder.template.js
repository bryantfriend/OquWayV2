import { getPhraseDefaultContent } from "../../phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "phrase-dialog-builder";
const TEMPLATE_PATCH = {
  phrase: "I think the answer is...",
  meaning: "Use this to share an idea carefully.",
  usageExample: "I think the answer is input because it starts the process."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Phrase",
  title: "Dialog Builder",
  layout: "story-path",
  interaction: "choice",
  accent: "#ea580c",
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
