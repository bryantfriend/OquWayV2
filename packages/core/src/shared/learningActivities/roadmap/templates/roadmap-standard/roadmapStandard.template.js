import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-standard";
const TEMPLATE_PATCH = {
  title: "Learning Roadmap",
  theme: "roadmap",
  instructions: "Choose the next milestone in the path.",
  data: "Start\nPractice\nApply\nReflect"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Roadmap",
  title: "Learning Roadmap",
  layout: "story-path",
  interaction: "choice",
  accent: "#2563eb",
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
