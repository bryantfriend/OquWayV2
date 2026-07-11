import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-standard";
const TEMPLATE_PATCH = {
  "title": "Input Device Island",
  "subtitle": "Drag each item to a useful bay.",
  "items": "Keyboard\nMouse\nMonitor\nPrinter",
  "theme": "sunny"
};
const TEMPLATE_OPTIONS = {
  "title": "Island Match",
  "archetype": "drag-bays",
  "eyebrow": "Drag Match",
  "accent": "#0891b2",
  "zones": [
    "Input",
    "Output",
    "Other"
  ]
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getDragMatchIslandDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
