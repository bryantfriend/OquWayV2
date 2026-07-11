import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-timed-pitch";
const TEMPLATE_PATCH = {
  "prompt": "Pitch your best digital safety tip in under one minute.",
  "preparationSeconds": 15,
  "speakingSeconds": 45
};
const TEMPLATE_OPTIONS = {
  "title": "Timed Pitch",
  "archetype": "boss-battle",
  "eyebrow": "Speaking",
  "accent": "#dc2626",
  "bossName": "Timer"
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
