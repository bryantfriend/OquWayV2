import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-standard";
const TEMPLATE_PATCH = {
  prompt: "Explain the idea in your own words.",
  preparationSeconds: 30,
  speakingSeconds: 60
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Speaking Prompt",
  title: "Quick Speak",
  layout: "studio-card",
  interaction: "text",
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
  return mergeTemplateContent(TEMPLATE_ID, getSpeakingPromptDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
