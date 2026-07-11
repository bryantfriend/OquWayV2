import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-safety-scan";
const TEMPLATE_PATCH = {
  "experienceType": "multi-select",
  "title": "Safety Scan",
  "theme": "scanner",
  "instructions": "Scan each option and select the safe choices.",
  "data": "Check URL\nShare password\nAsk teacher\nClick pop-up"
};
const TEMPLATE_OPTIONS = {
  "title": "Safety Scan",
  "archetype": "scanner-grid",
  "eyebrow": "Multi Select",
  "accent": "#0891b2"
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
