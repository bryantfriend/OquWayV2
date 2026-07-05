import { ExternalTaskStep } from "../../stepTypes/ExternalTaskStep.js?v=1.1.226-learning-activity-files";

export const externalTaskSchema = ExternalTaskStep.editorSchema || { fields: [] };

export function getExternalTaskDefaultContent() {
  return {
    "title": "Create a One-Slide Summary",
    "instructions": "Create one slide that explains the lesson idea, then upload proof for review.",
    "checklist": [
      "Slide has a title",
      "Slide has one useful example",
      "Slide is saved clearly"
    ],
    "proofRequired": "false",
    "allowedProofTypes": "image,document",
    "allowStudentNote": "true",
    "maxFiles": 3,
    "maxFileSizeMb": 10,
    "completionMode": "teacherReview"
  };
}

export function normalizeExternalTaskConfig(config) {
  return ExternalTaskStep.createConfig(Object.assign({}, getExternalTaskDefaultContent(), config || {}));
}

export function validateExternalTaskConfig(config) {
  var normalized = normalizeExternalTaskConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
