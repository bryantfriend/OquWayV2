import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-standard";
const TEMPLATE_PATCH = {
  question: "How confident do you feel about this skill?",
  responseType: "scale",
  minWords: 0
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Reflection",
  title: "Confidence Scale",
  layout: "reflection-journal",
  interaction: "reflection",
  accent: "#7c3aed",
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
