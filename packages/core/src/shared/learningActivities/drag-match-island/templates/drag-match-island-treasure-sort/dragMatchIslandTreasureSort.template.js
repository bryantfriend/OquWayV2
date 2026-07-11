import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-treasure-sort";
const TEMPLATE_PATCH = {
  "title": "Treasure Sort",
  "subtitle": "Open treasure clues before sorting.",
  "items": "CPU\nRAM\nStorage\nScreen",
  "theme": "treasure"
};
const TEMPLATE_OPTIONS = {
  "title": "Treasure Sort",
  "archetype": "evidence-board",
  "eyebrow": "Drag Match",
  "accent": "#b45309"
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
