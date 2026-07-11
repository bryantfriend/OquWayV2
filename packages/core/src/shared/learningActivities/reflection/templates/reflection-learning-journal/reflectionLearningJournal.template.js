import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-learning-journal";
const TEMPLATE_PATCH = {
  "question": "Describe what challenged you and what helped you move forward.",
  "responseType": "longText",
  "minWords": 20
};
const TEMPLATE_OPTIONS = {
  "title": "Learning Journal",
  "archetype": "card-stack",
  "eyebrow": "Reflection",
  "accent": "#ea580c"
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
