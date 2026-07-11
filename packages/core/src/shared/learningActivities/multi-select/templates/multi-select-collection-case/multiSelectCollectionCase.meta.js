export const multiSelectCollectionCaseMeta = {
  templateId: "multi-select-collection-case",
  activityType: "multi-select",
  displayName: "Collection Case",
  description: "Collection Case turns Multi Select into a evidence board mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "evidence-board",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-collection-case/multiSelectCollectionCase.template.js",
  "css": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-collection-case/multiSelectCollectionCase.css",
  "meta": "packages/core/src/shared/learningActivities/multi-select/templates/multi-select-collection-case/multiSelectCollectionCase.meta.js"
}
};
