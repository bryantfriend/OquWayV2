import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-standard";
const TEMPLATE_PATCH = {
  title: "Sort the Set",
  subtitle: "Choose how the items should be grouped.",
  items: "Input\nProcess\nOutput\nStorage",
  theme: "sorting"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Sorting",
  title: "Sort the Set",
  layout: "island-board",
  interaction: "drag",
  accent: "#0284c7",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getSortingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
