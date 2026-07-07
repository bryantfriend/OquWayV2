import { getDragMatchIslandDefaultContent } from "../../dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "dragMatchIsland-treasure-sort";
const TEMPLATE_PATCH = {
  title: "Treasure Sort",
  subtitle: "Sort the clues into the best order.",
  items: "Read the clue\nMatch the tool\nCheck the result\nExplain why",
  theme: "treasure"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Drag Match Island",
  title: "Treasure Sort",
  layout: "story-path",
  interaction: "drag",
  accent: "#d97706",
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
