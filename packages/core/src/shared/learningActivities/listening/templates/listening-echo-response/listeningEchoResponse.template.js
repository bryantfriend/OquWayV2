import { getListeningDefaultContent } from "../../listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "listening-echo-response";
const TEMPLATE_PATCH = {
  questionPrompt: "Listen, repeat the sentence, and mark it complete.",
  transcript: "Repeat this sentence with clear pronunciation."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Listening",
  title: "Echo Response",
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
  return mergeTemplateContent(TEMPLATE_ID, getListeningDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
