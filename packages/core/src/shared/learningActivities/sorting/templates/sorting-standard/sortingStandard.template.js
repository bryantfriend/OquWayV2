import { getSortingDefaultContent } from "../../sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "sorting-standard";
const TEMPLATE_PATCH = {
  "title": "Sort the Ideas",
  "subtitle": "Move each item to the best matching place.",
  "items": "Example 1\nExample 2\nExample 3\nExample 4",
  "theme": "sunny"
};
const TEMPLATE_OPTIONS = {
  "title": "Sort the Set",
  "archetype": "drag-bays",
  "eyebrow": "Sorting",
  "accent": "#2563eb",
  "zones": [
    "Group A",
    "Group B",
    "Review"
  ]
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
