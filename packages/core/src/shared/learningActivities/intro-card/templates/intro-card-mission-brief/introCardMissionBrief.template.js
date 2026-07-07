import { getIntroCardDefaultContent } from "../../introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "intro-card-mission-brief";
const TEMPLATE_PATCH = {
  heading: "Mission Brief",
  bodyText: "Your goal is to solve the challenge step by step.",
  calloutText: "Look for clues and explain your choices."
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Intro Card",
  title: "Mission Brief",
  layout: "terminal-run",
  interaction: "choice",
  accent: "#0f766e",
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
