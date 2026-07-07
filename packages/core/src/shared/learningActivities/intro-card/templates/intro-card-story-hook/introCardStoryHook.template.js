import { getIntroCardDefaultContent } from "../../introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "intro-card-story-hook";
const TEMPLATE_PATCH = {
  heading: "The Story Starts Here",
  bodyText: "Set the scene with a learner-friendly scenario.",
  calloutText: "Keep this question in mind as you work."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Intro Card",
  title: "Story Hook",
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
  return mergeTemplateContent(TEMPLATE_ID, getIntroCardDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
