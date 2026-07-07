import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-standard";
const TEMPLATE_PATCH = {
  title: "Island Match",
  subtitle: "Choose the card that belongs first.",
  items: "Keyboard\nMouse\nMonitor\nPrinter",
  theme: "sunny"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Drag Match Island",
  title: "Island Match",
  layout: "island-board",
  interaction: "drag",
  accent: "#0284c7",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getDragMatchIslandDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
