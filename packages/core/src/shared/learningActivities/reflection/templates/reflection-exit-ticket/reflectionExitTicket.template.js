import { getReflectionDefaultContent } from "../../reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "reflection-exit-ticket";
const TEMPLATE_PATCH = {
  "question": "What is one thing you learned before leaving this activity?",
  "responseType": "shortText",
  "minWords": 8
};
const TEMPLATE_OPTIONS = {
  "title": "Exit Ticket",
  "archetype": "builder-workbench",
  "eyebrow": "Reflection",
  "accent": "#16a34a"
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
