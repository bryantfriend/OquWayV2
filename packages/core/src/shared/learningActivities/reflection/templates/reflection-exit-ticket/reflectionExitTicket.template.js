import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-exit-ticket";
const TEMPLATE_PATCH = {
  question: "What is one thing you can do now that you could not do before?",
  responseType: "shortText",
  minWords: 5
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Reflection",
  title: "Exit Ticket",
  layout: "studio-card",
  interaction: "text",
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
  return mergeTemplateContent(TEMPLATE_ID, getReflectionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
