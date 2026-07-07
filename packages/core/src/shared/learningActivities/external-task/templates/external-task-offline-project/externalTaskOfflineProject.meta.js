export const externalTaskOfflineProjectMeta = {
  templateId: "externalTask-offline-project",
  activityType: "externalTask",
  displayName: "Offline Project",
  description: "A real-world or software task submitted for teacher review.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "external", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/external-task/templates/external-task-offline-project/externalTaskOfflineProject.template.js",
    css: "packages/core/src/shared/learningActivities/external-task/templates/external-task-offline-project/externalTaskOfflineProject.css",
    meta: "packages/core/src/shared/learningActivities/external-task/templates/external-task-offline-project/externalTaskOfflineProject.meta.js"
  }
};
