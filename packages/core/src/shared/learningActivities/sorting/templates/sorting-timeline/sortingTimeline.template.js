import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-timeline";
const TEMPLATE_PATCH = {
  title: "Timeline Sort",
  subtitle: "Put the process in order.",
  items: "Read the prompt\nPlan the answer\nCheck your work\nSubmit",
  theme: "timeline"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Sorting",
  title: "Timeline Sort",
  layout: "story-path",
  interaction: "drag",
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
  return mergeTemplateContent(TEMPLATE_ID, getSortingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
