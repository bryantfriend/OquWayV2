import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-standard";
const TEMPLATE_PATCH = {
  "title": "Create a One-Slide Summary",
  "instructions": "Create one slide and upload it for teacher review.",
  "checklist": [
    "Slide has a title",
    "Slide has one useful example",
    "File is saved clearly"
  ],
  "proofRequired": "true",
  "allowedProofTypes": "image,document",
  "allowStudentNote": "true",
  "maxFiles": 3,
  "maxFileSizeMb": 10,
  "completionMode": "teacherReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Proof Upload",
  "archetype": "upload-studio",
  "eyebrow": "External Task",
  "accent": "#2563eb"
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
