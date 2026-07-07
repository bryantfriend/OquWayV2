import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-harbor-pairs";
const TEMPLATE_PATCH = {
  title: "Harbor Pairs",
  subtitle: "Pair each item with its role.",
  items: "Input device\nOutput device\nStorage\nNetwork",
  theme: "harbor"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Drag Match Island",
  title: "Harbor Pairs",
  layout: "field-lab",
  interaction: "drag",
  accent: "#0f766e",
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
