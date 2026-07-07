import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-project-lane";
const TEMPLATE_PATCH = {
  title: "Project Lane",
  theme: "project",
  instructions: "Move through planning, building, and sharing.",
  data: "Plan\nBuild\nTest\nShare"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Roadmap",
  title: "Project Lane",
  layout: "field-lab",
  interaction: "choice",
  accent: "#0891b2",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getRoadmapDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
