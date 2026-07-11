import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-boss-path";
const TEMPLATE_PATCH = {
  "experienceType": "roadmap",
  "title": "Boss Path",
  "theme": "challenge",
  "instructions": "Clear each challenge to finish the path.",
  "data": "Warm up\nPractice\nApply\nReflect"
};
const TEMPLATE_OPTIONS = {
  "title": "Boss Path",
  "archetype": "boss-battle",
  "eyebrow": "Roadmap",
  "accent": "#dc2626",
  "bossName": "Final Project"
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
