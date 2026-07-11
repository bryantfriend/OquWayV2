export const externalTaskScreenshotProofMeta = {
  templateId: "externalTask-screenshot-proof",
  activityType: "externalTask",
  displayName: "Screenshot Proof",
  description: "Screenshot Proof turns External Task into a scanner grid mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "scanner-grid",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.template.js",
  "css": "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.css",
  "meta": "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.meta.js"
}
};
