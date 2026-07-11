import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-lab-simulator";
const TEMPLATE_PATCH = {
  "title": "Lab Simulator",
  "theme": "lab",
  "instructions": "Run the simulator commands in a safe practice space.",
  "data": "load tools\nrun test\nexplain result"
};
const TEMPLATE_OPTIONS = {
  "title": "Lab Simulator",
  "archetype": "terminal-challenge",
  "eyebrow": "Custom Experience",
  "accent": "#0891b2"
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
