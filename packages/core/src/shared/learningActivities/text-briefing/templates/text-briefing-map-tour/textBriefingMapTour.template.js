import { getTextBriefingDefaultContent } from "../../textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "textBriefing-map-tour";
const TEMPLATE_PATCH = {
  "heading": "Map Tour",
  "bodyText": "Visit each stop to preview the lesson idea.",
  "calloutText": "Each stop reveals one useful detail."
};
const TEMPLATE_OPTIONS = {
  "title": "Map Tour",
  "archetype": "quest-map",
  "eyebrow": "Briefing",
  "accent": "#ea580c"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getTextBriefingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
