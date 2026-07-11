import { getExternalTaskDefaultContent } from "../../externalTask.schema.js?v=1.1.228-learning-activity-drag-interactions";
import {
  destroyMiniGameTemplate,
  mergeTemplateContent,
  renderMiniGameTemplate
} from "../../../miniGameTemplateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

const TEMPLATE_ID = "externalTask-review-station";
const TEMPLATE_PATCH = {
  "title": "Review Station",
  "instructions": "Check each evidence card before uploading final work.",
  "checklist": [
    "Meets instructions",
    "Looks neat",
    "Saved correctly",
    "Ready for feedback"
  ],
  "proofRequired": "true",
  "allowedProofTypes": "image,document,spreadsheet,presentation",
  "allowStudentNote": "true",
  "maxFiles": 5,
  "maxFileSizeMb": 20,
  "completionMode": "teacherReview"
};
const TEMPLATE_OPTIONS = {
  "title": "Review Station",
  "archetype": "evidence-board",
  "eyebrow": "External Task",
  "accent": "#7c3aed"
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
