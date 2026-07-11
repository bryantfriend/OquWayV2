import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-partner-coach";
const TEMPLATE_PATCH = {
  "prompt": "Coach a partner through saving a file correctly.",
  "preparationSeconds": 30,
  "speakingSeconds": 60
};
const TEMPLATE_OPTIONS = {
  "title": "Partner Coach",
  "archetype": "dialog-builder",
  "eyebrow": "Speaking",
  "accent": "#16a34a"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getSpeakingPromptDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
