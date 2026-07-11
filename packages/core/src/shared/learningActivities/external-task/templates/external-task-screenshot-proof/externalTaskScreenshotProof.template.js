import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-screenshot-proof";
const TEMPLATE_PATCH = {
  "title": "Screenshot Proof",
  "instructions": "Complete the software task, then capture evidence of the result.",
  "checklist": [
    "Task is visible",
    "Name is visible",
    "Screenshot is uploaded"
  ],
  "proofRequired": "true",
  "allowedProofTypes": "image",
  "allowStudentNote": "true",
  "maxFiles": 2,
  "maxFileSizeMb": 8,
  "completionMode": "teacherReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Screenshot Proof",
  "archetype": "scanner-grid",
  "eyebrow": "External Task",
  "accent": "#0891b2"
};

export function renderTemplate(activityContext) {
  renderMiniGameTemplate(activityContext, TEMPLATE_OPTIONS);
}

export function destroyTemplate(activityContext) {
  destroyMiniGameTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return mergeTemplateContent(TEMPLATE_ID, getExternalTaskDefaultContent(), TEMPLATE_PATCH);
}

export function getTemplatePreviewContent() {
  return getTemplateDefaultContent();
}
