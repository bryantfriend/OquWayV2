export const multipleChoiceCheckpointMeta = {
  templateId: "multiple-choice-checkpoint",
  activityType: "multiple-choice",
  displayName: "Checkpoint",
  description: "A single-choice activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.template.js",
    css: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.css",
    meta: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.meta.js"
  }
};
