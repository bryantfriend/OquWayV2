import { getMultipleChoiceDefaultContent } from "../../multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "multiple-choice-scenario";
const TEMPLATE_PATCH = {
  title: "Scenario Choice",
  theme: "scenario",
  instructions: "Read the situation and choose the strongest next move.",
  data: "Ask a clarifying question\nGuess quickly\nIgnore the clue\nSkip the task"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "Multiple Choice",
  title: "Scenario Choice",
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
  return mergeTemplateContent(TEMPLATE_ID, getMultipleChoiceDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
