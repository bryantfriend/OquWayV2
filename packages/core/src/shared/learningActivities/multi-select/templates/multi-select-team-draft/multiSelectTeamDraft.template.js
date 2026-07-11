import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-team-draft";
const TEMPLATE_PATCH = {
  "experienceType": "multi-select",
  "title": "Team Draft",
  "theme": "draft",
  "instructions": "Draft the best options onto your team.",
  "data": "Save work\nUse clear names\nIgnore instructions\nReview before upload"
};
const TEMPLATE_OPTIONS = {
  "title": "Team Draft",
  "archetype": "drag-bays",
  "eyebrow": "Multi Select",
  "accent": "#16a34a",
  "zones": [
    "Team",
    "Maybe",
    "Bench"
  ]
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getMultiSelectDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
