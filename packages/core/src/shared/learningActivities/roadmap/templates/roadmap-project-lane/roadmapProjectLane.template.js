import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-project-lane";
const TEMPLATE_PATCH = {
  "experienceType": "roadmap",
  "title": "Project Lane",
  "theme": "kanban",
  "instructions": "Move project work into the right lane.",
  "data": "Plan file\nBuild slide\nCheck formula\nUpload proof"
};
const TEMPLATE_OPTIONS = {
  "title": "Project Lane",
  "archetype": "drag-bays",
  "eyebrow": "Roadmap",
  "accent": "#0891b2",
  "zones": [
    "To Do",
    "Doing",
    "Done"
  ]
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
