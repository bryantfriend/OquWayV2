import { getListeningDefaultContent } from "../../listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "listening-sound-detective";
const TEMPLATE_PATCH = {
  "questionPrompt": "Open each clue from the audio.",
  "transcript": "The teacher explains that input, process, and output work together."
};
const TEMPLATE_OPTIONS = {
  "title": "Sound Detective",
  "archetype": "evidence-board",
  "eyebrow": "Listening",
  "accent": "#b45309"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getListeningDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
