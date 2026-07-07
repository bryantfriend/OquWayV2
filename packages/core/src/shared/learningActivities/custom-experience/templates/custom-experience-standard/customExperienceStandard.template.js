import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-standard";
const TEMPLATE_PATCH = {
  title: "Custom Experience",
  theme: "studio",
  instructions: "Explore the prompt, choose a path, and complete the activity.",
  data: "Plan\nBuild\nShare"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Custom Experience",
  title: "Studio Card",
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
  return mergeTemplateContent(TEMPLATE_ID, getCustomExperienceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
