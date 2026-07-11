import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-mystery-door";
const TEMPLATE_PATCH = {
  "experienceType": "multiple-choice",
  "title": "Mystery Door",
  "theme": "mystery",
  "instructions": "Reveal clues before choosing the answer.",
  "data": "Clue A\nClue B\nClue C\nFinal choice"
};
const TEMPLATE_OPTIONS = {
  "title": "Mystery Door",
  "archetype": "evidence-board",
  "eyebrow": "Multiple Choice",
  "accent": "#7c3aed"
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
