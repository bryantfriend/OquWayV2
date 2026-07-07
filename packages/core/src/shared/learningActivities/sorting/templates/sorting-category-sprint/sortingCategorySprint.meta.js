export const sortingCategorySprintMeta = {
  templateId: "sorting-category-sprint",
  activityType: "sorting",
  displayName: "Category Sprint",
  description: "A sorting activity shell backed by the drag-match player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "drag", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/sorting/templates/sorting-category-sprint/sortingCategorySprint.template.js",
    css: "packages/core/src/shared/learningActivities/sorting/templates/sorting-category-sprint/sortingCategorySprint.css",
    meta: "packages/core/src/shared/learningActivities/sorting/templates/sorting-category-sprint/sortingCategorySprint.meta.js"
  }
};
