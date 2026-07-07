export const multiSelectSafetyScanMeta = {
  templateId: "multi-select-safety-scan",
  activityType: "multi-select",
  displayName: "Safety Scan",
  description: "A multi-select activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.template.js",
    css: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.css",
    meta: "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.meta.js"
  }
};
