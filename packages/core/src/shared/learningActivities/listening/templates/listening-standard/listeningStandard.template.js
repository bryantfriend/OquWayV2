import { getListeningDefaultContent } from "../../listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "listening-standard";
const TEMPLATE_PATCH = {
  questionPrompt: "Listen for the main idea, then complete the check.",
  transcript: "The speaker explains the main point and gives one example."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Listening",
  title: "Listen and Check",
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
  return mergeTemplateContent(TEMPLATE_ID, getListeningDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
