import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-learning-journal";
const TEMPLATE_PATCH = {
  question: "Describe what challenged you and what helped you move forward.",
  responseType: "longText",
  minWords: 20
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Reflection",
  title: "Learning Journal",
  layout: "story-path",
  interaction: "text",
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
  return mergeTemplateContent(TEMPLATE_ID, getReflectionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
