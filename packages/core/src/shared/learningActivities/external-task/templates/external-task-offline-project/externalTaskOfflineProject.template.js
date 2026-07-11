import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-offline-project";
const TEMPLATE_PATCH = {
  "title": "Offline Project",
  "instructions": "Build the project in Word, PowerPoint, or Excel, then upload it.",
  "checklist": [
    "Open the correct app",
    "Complete every requirement",
    "Save with your name"
  ],
  "proofRequired": "true",
  "allowedProofTypes": "document,spreadsheet,presentation",
  "allowStudentNote": "true",
  "maxFiles": 3,
  "maxFileSizeMb": 20,
  "completionMode": "teacherReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Offline Project",
  "archetype": "builder-workbench",
  "eyebrow": "External Task",
  "accent": "#16a34a"
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
