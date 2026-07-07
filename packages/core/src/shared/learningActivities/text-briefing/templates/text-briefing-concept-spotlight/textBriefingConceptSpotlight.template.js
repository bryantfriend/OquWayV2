import { getTextBriefingDefaultContent } from "../../textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "textBriefing-concept-spotlight";
const TEMPLATE_PATCH = {
  heading: "Concept Spotlight",
  bodyText: "This view highlights one important concept and its example.",
  calloutText: "Ask: what changes, and what stays the same?"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Text Briefing",
  title: "Concept Spotlight",
  layout: "field-lab",
  interaction: "choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getTextBriefingDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
