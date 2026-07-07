import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-standard";
const TEMPLATE_PATCH = {
  title: "Pick All That Apply",
  theme: "quiz",
  instructions: "Select every answer that fits the prompt.",
  data: "Strong password\nShared password\nTwo-factor login\nUnknown link"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multi Select",
  title: "Pick All That Apply",
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
  return mergeTemplateContent(TEMPLATE_ID, getMultiSelectDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
