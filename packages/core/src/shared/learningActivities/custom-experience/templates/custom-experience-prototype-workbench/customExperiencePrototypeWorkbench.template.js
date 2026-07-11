import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-prototype-workbench";
const TEMPLATE_PATCH = {
  "title": "Prototype Workbench",
  "theme": "prototype",
  "instructions": "Choose tools and draft what the student should do next.",
  "data": "Plan\nBuild\nTest\nImprove"
};
const TEMPLATE_OPTIONS = {
  "title": "Prototype Workbench",
  "archetype": "builder-workbench",
  "eyebrow": "Custom Experience",
  "accent": "#16a34a"
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
