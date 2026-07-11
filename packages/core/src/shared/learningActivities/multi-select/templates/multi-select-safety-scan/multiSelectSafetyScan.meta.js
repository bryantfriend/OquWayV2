export const multiSelectSafetyScanMeta = {
  templateId: "multi-select-safety-scan",
  activityType: "multi-select",
  displayName: "Safety Scan",
  description: "Safety Scan turns Multi Select into a scanner grid mini-game.",
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
  "template": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.template.js",
  "css": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.css",
  "meta": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-safety-scan/multiSelectSafetyScan.meta.js"
}
};
