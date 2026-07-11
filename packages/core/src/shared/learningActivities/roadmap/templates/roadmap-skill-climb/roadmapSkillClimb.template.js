import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-skill-climb";
const TEMPLATE_PATCH = {
  "experienceType": "roadmap",
  "title": "Skill Climb",
  "theme": "climb",
  "instructions": "Unlock each rung as your skill grows.",
  "data": "Learn\nTry\nFix\nMaster"
};
const TEMPLATE_OPTIONS = {
  "title": "Skill Climb",
  "archetype": "timeline-unlock",
  "eyebrow": "Roadmap",
  "accent": "#16a34a"
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
