import { getIntroCardDefaultContent } from "../../introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "intro-card-mystery-door";
const TEMPLATE_PATCH = {
  "heading": "Mystery Door",
  "bodyText": "Open the clues to preview what this lesson unlocks.",
  "calloutText": "One clue will matter most."
};
const TEMPLATE_OPTIONS = {
  "title": "Mystery Door",
  "archetype": "evidence-board",
  "eyebrow": "Intro",
  "accent": "#b45309"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getIntroCardDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
