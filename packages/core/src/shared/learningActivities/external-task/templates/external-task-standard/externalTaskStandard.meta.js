export const externalTaskStandardMeta = {
  templateId: "externalTask-standard",
  activityType: "externalTask",
  displayName: "Proof Upload",
  description: "A real-world or software task submitted for teacher review.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["task-brief", "external", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.template.js",
    css: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.css",
    meta: "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.meta.js"
  }
};
