import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-standard";
const TEMPLATE_PATCH = {
  "experienceType": "multiple-choice",
  "title": "Check Your Understanding",
  "theme": "assessment",
  "instructions": "Choose the best answer.",
  "data": "Input\nOutput\nStorage\nNetwork"
};
const TEMPLATE_OPTIONS = {
  "title": "Quick Choice",
  "archetype": "quiz-show",
  "eyebrow": "Multiple Choice",
  "accent": "#2563eb"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getMultipleChoiceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
