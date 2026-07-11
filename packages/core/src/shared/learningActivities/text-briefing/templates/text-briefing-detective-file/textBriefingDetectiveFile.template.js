import { getTextBriefingDefaultContent } from "../../textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "textBriefing-detective-file";
const TEMPLATE_PATCH = {
  "heading": "Detective File",
  "bodyText": "Open each evidence card to understand the concept.",
  "calloutText": "Find the clue that explains the lesson."
};
const TEMPLATE_OPTIONS = {
  "title": "Detective File",
  "archetype": "evidence-board",
  "eyebrow": "Briefing",
  "accent": "#b45309"
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
