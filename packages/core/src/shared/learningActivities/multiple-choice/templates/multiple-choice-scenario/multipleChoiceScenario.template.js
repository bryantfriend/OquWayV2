import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-scenario";
const TEMPLATE_PATCH = {
  "experienceType": "multiple-choice",
  "title": "Scenario Choice",
  "theme": "scenario",
  "instructions": "Read the situation and choose the strongest next move.",
  "data": "Ask a clarifying question\nGuess quickly\nIgnore the clue\nSkip the task"
};
const TEMPLATE_OPTIONS = {
  "title": "Scenario Choice",
  "archetype": "quest-map",
  "eyebrow": "Multiple Choice",
  "accent": "#ea580c"
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
