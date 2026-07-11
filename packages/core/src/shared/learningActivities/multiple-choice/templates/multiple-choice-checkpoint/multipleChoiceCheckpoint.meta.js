export const multipleChoiceCheckpointMeta = {
  templateId: "multiple-choice-checkpoint",
  activityType: "multiple-choice",
  displayName: "Checkpoint Gate",
  description: "Checkpoint Gate turns Multiple Choice into a timeline unlock mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "timeline-unlock",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.template.js",
  "css": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.css",
  "meta": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.meta.js"
}
};
