import { getCustomExperienceDefaultContent } from "../../customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "customExperience-mystery-box";
const TEMPLATE_PATCH = {
  "title": "Mystery Box",
  "theme": "mystery",
  "instructions": "Open each clue to discover how the experience works.",
  "data": "Hidden goal\nSecret tool\nFinal reveal"
};
const TEMPLATE_OPTIONS = {
  "title": "Mystery Box",
  "archetype": "evidence-board",
  "eyebrow": "Custom Experience",
  "accent": "#b45309"
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
