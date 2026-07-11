import { getSpeakingPromptDefaultContent } from "../../speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "speakingPrompt-standard";
const TEMPLATE_PATCH = {
  "prompt": "Explain one way to stay safe online.",
  "preparationSeconds": 20,
  "speakingSeconds": 45
};
const TEMPLATE_OPTIONS = {
  "title": "Quick Speak",
  "archetype": "mood-meter",
  "eyebrow": "Speaking",
  "accent": "#2563eb"
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
