import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-standard";
const TEMPLATE_PATCH = {
  "experienceType": "multi-select",
  "title": "Select All That Apply",
  "theme": "assessment",
  "instructions": "Select every correct option.",
  "data": "Strong password\nPublic password\nPrivate account\nUnknown link"
};
const TEMPLATE_OPTIONS = {
  "title": "Pick All That Apply",
  "archetype": "matrix-grid",
  "eyebrow": "Multi Select",
  "accent": "#2563eb"
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
