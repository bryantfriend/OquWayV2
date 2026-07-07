import { getTextBriefingDefaultContent } from "../../textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "textBriefing-guided-checkpoint";
const TEMPLATE_PATCH = {
  heading: "Guided Checkpoint",
  bodyText: "Pause and check your understanding before continuing.",
  calloutText: "Choose the statement that best matches the reading."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Text Briefing",
  title: "Guided Checkpoint",
  layout: "story-path",
  interaction: "choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getTextBriefingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
