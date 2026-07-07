export const vocabularyExampleBuilderMeta = {
  templateId: "vocabulary-example-builder",
  activityType: "vocabulary",
  displayName: "Example Builder",
  description: "A vocabulary review shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-example-builder/vocabularyExampleBuilder.template.js",
    css: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-example-builder/vocabularyExampleBuilder.css",
    meta: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-example-builder/vocabularyExampleBuilder.meta.js"
  }
};
