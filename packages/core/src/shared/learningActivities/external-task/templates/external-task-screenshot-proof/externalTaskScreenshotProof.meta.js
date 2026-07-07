export const externalTaskScreenshotProofMeta = {
  templateId: "externalTask-screenshot-proof",
  activityType: "externalTask",
  displayName: "Screenshot Proof",
  description: "A real-world or software task submitted for teacher review.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "external", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.template.js",
    css: "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.css",
    meta: "packages/core/src/shared/learningActivities/external-task/templates/external-task-screenshot-proof/externalTaskScreenshotProof.meta.js"
  }
};
