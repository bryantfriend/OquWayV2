export const multiSelectStandardMeta = {
  templateId: "multi-select-standard",
  activityType: "multi-select",
  displayName: "Pick All That Apply",
  description: "Pick All That Apply turns Multi Select into a matrix grid mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "matrix-grid",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.template.js",
  "css": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.css",
  "meta": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-standard/multiSelectStandard.meta.js"
}
};
