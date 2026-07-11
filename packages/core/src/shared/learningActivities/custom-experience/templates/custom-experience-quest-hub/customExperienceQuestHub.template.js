import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-quest-hub";
const TEMPLATE_PATCH = {
  "title": "Quest Hub",
  "theme": "quest",
  "instructions": "Pick a route through the learning quest.",
  "data": "Scout the problem\nCollect clues\nExplain the solution"
};
const TEMPLATE_OPTIONS = {
  "title": "Quest Hub",
  "archetype": "quest-map",
  "eyebrow": "Custom Experience",
  "accent": "#ea580c"
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
