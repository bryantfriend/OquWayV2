import { getIntroCardDefaultContent } from "../../introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "intro-card-story-hook";
const TEMPLATE_PATCH = {
  "heading": "Story Hook",
  "bodyText": "A student has a problem to solve. Your lesson will help them solve it.",
  "calloutText": "Choose the first clue."
};
const TEMPLATE_OPTIONS = {
  "title": "Story Hook",
  "archetype": "quest-map",
  "eyebrow": "Intro",
  "accent": "#ea580c"
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
