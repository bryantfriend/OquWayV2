export const sortingStandardMeta = {
  templateId: "sorting-standard",
  activityType: "sorting",
  displayName: "Sorting Standard",
  description: "Sort or match items using the existing drag-match activity engine.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Games", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.template.js",
    css: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.css",
    meta: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.meta.js"
  }
};
