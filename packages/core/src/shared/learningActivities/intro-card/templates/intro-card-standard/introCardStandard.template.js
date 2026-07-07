import { getIntroCardDefaultContent } from "../../introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "intro-card-standard";
const TEMPLATE_PATCH = {
  heading: "Welcome In",
  bodyText: "Start with the big idea and what learners will practice.",
  calloutText: "Today you will learn by trying, checking, and improving."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Intro Card",
  title: "Welcome Card",
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
  return mergeTemplateContent(TEMPLATE_ID, getIntroCardDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
