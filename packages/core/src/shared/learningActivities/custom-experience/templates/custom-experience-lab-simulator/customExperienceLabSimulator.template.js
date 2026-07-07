import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-lab-simulator";
const TEMPLATE_PATCH = {
  title: "Simulation Lab",
  theme: "lab",
  instructions: "Choose the tool that best solves the challenge.",
  data: "Observe\nTest\nImprove"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Custom Experience",
  title: "Lab Simulator",
  layout: "field-lab",
  interaction: "choice",
  accent: "#0891b2",
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
