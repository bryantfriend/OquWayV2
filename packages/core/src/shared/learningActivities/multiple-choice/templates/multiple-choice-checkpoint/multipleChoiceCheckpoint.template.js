import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-checkpoint";
const TEMPLATE_PATCH = {
  "experienceType": "multiple-choice",
  "title": "Checkpoint Gate",
  "theme": "checkpoint",
  "instructions": "Unlock the question gate one checkpoint at a time.",
  "data": "Read question\nCompare answers\nChoose best\nExplain why"
};
const TEMPLATE_OPTIONS = {
  "title": "Checkpoint Gate",
  "archetype": "timeline-unlock",
  "eyebrow": "Multiple Choice",
  "accent": "#16a34a"
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
