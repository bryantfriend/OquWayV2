import { getTextBriefingDefaultContent } from "../../textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "textBriefing-standard";
const TEMPLATE_PATCH = {
  heading: "Key Idea",
  bodyText: "Read this short explanation before you try the activity.",
  calloutText: "Focus on the words that explain cause and effect."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Text Briefing",
  title: "Briefing Card",
  layout: "studio-card",
  interaction: "choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getTextBriefingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
