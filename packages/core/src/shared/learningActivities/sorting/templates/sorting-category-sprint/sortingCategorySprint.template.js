import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-category-sprint";
const TEMPLATE_PATCH = {
  title: "Category Sprint",
  subtitle: "Choose the category that fits best.",
  items: "Hardware\nSoftware\nData\nNetwork",
  theme: "sprint"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Sorting",
  title: "Category Sprint",
  layout: "skill-sprint",
  interaction: "drag",
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
  return mergeTemplateContent(TEMPLATE_ID, getSortingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
