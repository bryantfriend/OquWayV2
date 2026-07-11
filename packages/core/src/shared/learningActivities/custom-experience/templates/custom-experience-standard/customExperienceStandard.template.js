import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-standard";
const TEMPLATE_PATCH = {
  "title": "Studio Control Room",
  "theme": "studio",
  "instructions": "Activate each part of the custom learning experience.",
  "data": "Goal panel\nPractice panel\nReflection panel"
};
const TEMPLATE_OPTIONS = {
  "title": "Studio Control Room",
  "archetype": "lab-switchboard",
  "eyebrow": "Custom Experience",
  "accent": "#2563eb"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getCustomExperienceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
