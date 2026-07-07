import { getListeningDefaultContent } from "../../listening.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "listening-transcript-hunt";
const TEMPLATE_PATCH = {
  questionPrompt: "Listen for three key words, then open the transcript.",
  transcript: "Keyword one, keyword two, and keyword three appear in context."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Listening",
  title: "Transcript Hunt",
  layout: "field-lab",
  interaction: "media",
  accent: "#0891b2",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getListeningDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
