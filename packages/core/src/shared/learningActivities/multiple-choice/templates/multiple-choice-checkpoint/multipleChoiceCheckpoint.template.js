import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-checkpoint";
const TEMPLATE_PATCH = {
  title: "Checkpoint",
  theme: "checkpoint",
  instructions: "Pick the concept that matches the example.",
  data: "Input\nOutput\nProcess\nStorage"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multiple Choice",
  title: "Checkpoint",
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
  return mergeTemplateContent(TEMPLATE_ID, getMultipleChoiceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
