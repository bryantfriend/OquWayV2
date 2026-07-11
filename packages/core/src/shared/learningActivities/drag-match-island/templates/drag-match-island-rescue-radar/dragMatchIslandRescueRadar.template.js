import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-rescue-radar";
const TEMPLATE_PATCH = {
  "title": "Rescue Radar",
  "subtitle": "Scan the island for matching items.",
  "items": "Cable\nRouter\nBrowser\nSearch",
  "theme": "radar"
};
const TEMPLATE_OPTIONS = {
  "title": "Rescue Radar",
  "archetype": "scanner-grid",
  "eyebrow": "Drag Match",
  "accent": "#7c3aed"
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
