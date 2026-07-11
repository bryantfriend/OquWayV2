import { getListeningDefaultContent } from "../../listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "listening-transcript-hunt";
const TEMPLATE_PATCH = {
  "questionPrompt": "Scan the transcript for important clues.",
  "transcript": "A strong password is long, private, and hard for others to guess."
};
const TEMPLATE_OPTIONS = {
  "title": "Transcript Hunt",
  "archetype": "scanner-grid",
  "eyebrow": "Listening",
  "accent": "#0891b2"
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
