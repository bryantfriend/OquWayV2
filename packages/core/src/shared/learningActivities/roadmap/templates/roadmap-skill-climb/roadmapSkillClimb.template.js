import { getRoadmapDefaultContent } from "../../roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "roadmap-skill-climb";
const TEMPLATE_PATCH = {
  title: "Skill Climb",
  theme: "climb",
  instructions: "Pick the skill level you are ready to try.",
  data: "Warm-up\nGuided challenge\nIndependent try\nStretch goal"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Roadmap",
  title: "Skill Climb",
  layout: "skill-sprint",
  interaction: "choice",
  accent: "#16a34a",
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
