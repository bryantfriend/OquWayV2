export const multiSelectStandardMeta = {
  templateId: "multi-select-standard",
  activityType: "multi-select",
  displayName: "Multi Select Standard",
  description: "Ask learners to select more than one answer using the custom activity shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Assessment", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.template.js",
    css: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.css",
    meta: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.meta.js"
  }
};
