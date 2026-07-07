import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-safety-scan";
const TEMPLATE_PATCH = {
  title: "Safety Scan",
  theme: "safety",
  instructions: "Select the risky choices.",
  data: "Clicking pop-ups\nChecking the sender\nSharing personal info\nAsking a teacher"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multi Select",
  title: "Safety Scan",
  layout: "field-lab",
  interaction: "choice",
  accent: "#dc2626",
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
