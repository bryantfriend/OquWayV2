import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-standard";
const TEMPLATE_PATCH = {
  title: "Create a PowerPoint slide",
  instructions: "Create one slide about internet safety, then upload proof.",
  checklist: [
    "Slide has a title",
    "Slide has one image",
    "Slide uses readable font"
  ],
  proofRequired: "true",
  allowedProofTypes: "image,document",
  allowStudentNote: "true",
  maxFiles: 3,
  maxFileSizeMb: 10,
  completionMode: "teacherReview"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "External Task",
  title: "Proof Upload",
  layout: "task-brief",
  interaction: "external",
  accent: "#2563eb",
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
