import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-standard";
const TEMPLATE_PATCH = {
  "experienceType": "roadmap",
  "title": "Learning Roadmap",
  "theme": "pathway",
  "instructions": "Review the checkpoints before you continue.",
  "data": "Start\nPractice\nApply"
};
const TEMPLATE_OPTIONS = {
  "title": "Learning Roadmap",
  "archetype": "roadmap-trail",
  "eyebrow": "Roadmap",
  "accent": "#2563eb"
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
