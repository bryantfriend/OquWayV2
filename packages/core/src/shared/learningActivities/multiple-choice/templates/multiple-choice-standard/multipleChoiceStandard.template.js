import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-standard";
const TEMPLATE_PATCH = {
  title: "Quick Choice",
  theme: "quiz",
  instructions: "Choose the best answer.",
  data: "Best answer\nAlmost right\nDistractor\nTry again"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multiple Choice",
  title: "Quick Choice",
  layout: "studio-card",
  interaction: "choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getMultipleChoiceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
