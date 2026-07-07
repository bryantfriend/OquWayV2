export const sortingStandardMeta = {
  templateId: "sorting-standard",
  activityType: "sorting",
  displayName: "Sort the Set",
  description: "A sorting activity shell backed by the drag-match player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["island-board", "drag", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.template.js",
    css: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.css",
    meta: "packages/core/src/shared/learningActivities/sorting/templates/sorting-standard/sortingStandard.meta.js"
  }
};
