import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-partner-coach";
const TEMPLATE_PATCH = {
  prompt: "Pretend you are coaching a classmate through the task.",
  preparationSeconds: 45,
  speakingSeconds: 90
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Speaking Prompt",
  title: "Partner Coach",
  layout: "story-path",
  interaction: "text",
  accent: "#ea580c",
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
