import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-boss-battle";
const TEMPLATE_PATCH = {
  "experienceType": "multiple-choice",
  "title": "Boss Battle",
  "theme": "battle",
  "instructions": "Choose the answer move that defeats the challenge.",
  "data": "Correct concept\nAlmost right\nDistractor\nWild guess"
};
const TEMPLATE_OPTIONS = {
  "title": "Boss Battle",
  "archetype": "boss-battle",
  "eyebrow": "Multiple Choice",
  "accent": "#dc2626",
  "bossName": "Misconception"
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
