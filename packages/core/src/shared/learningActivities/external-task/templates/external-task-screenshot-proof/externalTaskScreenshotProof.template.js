import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-screenshot-proof";
const TEMPLATE_PATCH = {
  title: "Show Your Finished Screen",
  instructions: "Finish the digital task and upload a screenshot of your result.",
  checklist: [
    "Task is complete",
    "Screenshot shows the full screen",
    "Name is visible if required"
  ],
  proofRequired: "true",
  allowedProofTypes: "image",
  allowStudentNote: "true",
  maxFiles: 2,
  maxFileSizeMb: 8,
  completionMode: "teacherReview"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "External Task",
  title: "Screenshot Proof",
  layout: "field-lab",
  interaction: "external",
  accent: "#0891b2",
  completeLabel: "Submit for review"
};

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getExternalTaskDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
