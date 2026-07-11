import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-museum-curator";
const TEMPLATE_PATCH = {
  "title": "Museum Curator",
  "subtitle": "Open exhibits and decide how to organize them.",
  "items": "Hardware\nSoftware\nNetwork\nData",
  "theme": "museum"
};
const TEMPLATE_OPTIONS = {
  "title": "Museum Curator",
  "archetype": "evidence-board",
  "eyebrow": "Sorting",
  "accent": "#b45309"
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
