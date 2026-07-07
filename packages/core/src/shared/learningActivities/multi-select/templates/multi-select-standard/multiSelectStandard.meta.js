export const multiSelectStandardMeta = {
  templateId: "multi-select-standard",
  activityType: "multi-select",
  displayName: "Pick All That Apply",
  description: "A multi-select activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.template.js",
    css: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.css",
    meta: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.meta.js"
  }
};
