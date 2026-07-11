import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-collection-case";
const TEMPLATE_PATCH = {
  "experienceType": "multi-select",
  "title": "Collection Case",
  "theme": "evidence",
  "instructions": "Open each evidence card, then select what belongs.",
  "data": "Input device\nOutput device\nStorage device\nRandom guess"
};
const TEMPLATE_OPTIONS = {
  "title": "Collection Case",
  "archetype": "evidence-board",
  "eyebrow": "Multi Select",
  "accent": "#b45309"
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
