import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-growth-garden";
const TEMPLATE_PATCH = {
  "question": "Which part of today's skill is growing strongest for you?",
  "responseType": "shortText",
  "minWords": 6
};
const TEMPLATE_OPTIONS = {
  "title": "Growth Garden",
  "archetype": "quest-map",
  "eyebrow": "Reflection",
  "accent": "#16a34a",
  "nodeLabel": "Growth"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getReflectionDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
