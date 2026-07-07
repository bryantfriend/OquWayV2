import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-timed-pitch";
const TEMPLATE_PATCH = {
  prompt: "Give a short pitch that includes the problem, solution, and evidence.",
  preparationSeconds: 60,
  speakingSeconds: 120
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Speaking Prompt",
  title: "Timed Pitch",
  layout: "skill-sprint",
  interaction: "text",
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
  return mergeTemplateContent(TEMPLATE_ID, getSpeakingPromptDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
