import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-map-tour";
const TEMPLATE_PATCH = {
  "experienceType": "roadmap",
  "title": "Map Tour",
  "theme": "map",
  "instructions": "Visit each stop to preview the lesson path.",
  "data": "Launch\nExplore\nCreate\nReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Map Tour",
  "archetype": "quest-map",
  "eyebrow": "Roadmap",
  "accent": "#ea580c"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getRoadmapDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
