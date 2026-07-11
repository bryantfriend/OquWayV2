import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-office-quest";
const TEMPLATE_PATCH = {
  "title": "Office Quest",
  "instructions": "Move through each checkpoint before submitting your file.",
  "checklist": [
    "Create",
    "Format",
    "Review",
    "Upload"
  ],
  "proofRequired": "true",
  "allowedProofTypes": "document,spreadsheet,presentation",
  "allowStudentNote": "true",
  "maxFiles": 4,
  "maxFileSizeMb": 20,
  "completionMode": "teacherReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Office Quest",
  "archetype": "quest-map",
  "eyebrow": "External Task",
  "accent": "#ea580c"
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
