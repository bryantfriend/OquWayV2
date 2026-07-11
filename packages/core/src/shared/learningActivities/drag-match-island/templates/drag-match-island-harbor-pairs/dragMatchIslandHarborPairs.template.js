import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-harbor-pairs";
const TEMPLATE_PATCH = {
  "title": "Harbor Pairs",
  "subtitle": "Sail to each match point.",
  "items": "Keyboard to typing\nMonitor to display\nPrinter to paper",
  "theme": "harbor"
};
const TEMPLATE_OPTIONS = {
  "title": "Harbor Pairs",
  "archetype": "quest-map",
  "eyebrow": "Drag Match",
  "accent": "#0284c7"
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
