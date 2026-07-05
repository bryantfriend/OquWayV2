export const externalTaskStandardMeta = {
  templateId: "externalTask-standard",
  activityType: "externalTask",
  displayName: "External Task Standard",
  description: "Assign work outside the player and collect proof for review.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Assessment", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.template.js",
    css: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.css",
    meta: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.meta.js"
  }
};
