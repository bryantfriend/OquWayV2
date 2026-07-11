export const externalTaskStandardMeta = {
  templateId: "externalTask-standard",
  activityType: "externalTask",
  displayName: "Proof Upload",
  description: "Proof Upload turns External Task into a upload studio mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "upload-studio",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.template.js",
  "css": "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.css",
  "meta": "packages/core/src/shared/learningActivities/external-task/templates/external-task-standard/externalTaskStandard.meta.js"
}
};
