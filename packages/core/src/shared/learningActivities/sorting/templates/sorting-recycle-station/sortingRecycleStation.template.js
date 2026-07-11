import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-recycle-station";
const TEMPLATE_PATCH = {
  "title": "Recycle Station",
  "subtitle": "Scan items before deciding where they belong.",
  "items": "Useful file\nDuplicate file\nOld draft\nFinal copy",
  "theme": "station"
};
const TEMPLATE_OPTIONS = {
  "title": "Recycle Station",
  "archetype": "scanner-grid",
  "eyebrow": "Sorting",
  "accent": "#0891b2"
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
