import { getMultiSelectDefaultContent } from "../../multiSelect.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multi-select-team-draft";
const TEMPLATE_PATCH = {
  title: "Team Draft",
  theme: "collaboration",
  instructions: "Choose the habits that help a team work well.",
  data: "Listen first\nInterrupt often\nShare evidence\nBuild on ideas"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multi Select",
  title: "Team Draft",
  layout: "skill-sprint",
  interaction: "choice",
  accent: "#16a34a",
  completeLabel: "Complete activity"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getMultiSelectDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
