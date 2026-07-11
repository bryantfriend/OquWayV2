import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-timeline";
const TEMPLATE_PATCH = {
  "title": "Timeline Sort",
  "subtitle": "Unlock events in the right order.",
  "items": "Start\nMiddle\nFinish\nReview",
  "theme": "timeline"
};
const TEMPLATE_OPTIONS = {
  "title": "Timeline Sort",
  "archetype": "timeline-unlock",
  "eyebrow": "Sorting",
  "accent": "#7c3aed"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getSortingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
