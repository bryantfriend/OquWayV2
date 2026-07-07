import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyLearningActivityTemplate,
  mergeTemplateContent,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-offline-project";
const TEMPLATE_PATCH = {
  title: "Offline Build Challenge",
  instructions: "Complete the project away from OquWay and upload a file or photo.",
  checklist: [
    "Followed the brief",
    "Included all required parts",
    "Saved or photographed the work"
  ],
  proofRequired: "true",
  allowedProofTypes: "image,document",
  allowStudentNote: "true",
  maxFiles: 4,
  maxFileSizeMb: 10,
  completionMode: "teacherReview"
};
const TEMPLATE_OPTIONS = {
  eyebrow: "External Task",
  title: "Offline Project",
  layout: "story-path",
  interaction: "external",
  accent: "#ea580c",
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
