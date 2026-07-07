import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-quest-hub";
const TEMPLATE_PATCH = {
  title: "Quest Hub",
  theme: "quest",
  instructions: "Pick your first move in the learning quest.",
  data: "Scout the problem\nCollect clues\nExplain the solution"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Custom Experience",
  title: "Quest Hub",
  layout: "story-path",
  interaction: "choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getCustomExperienceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
