export const vocabularyStandardMeta = {
  templateId: "vocabulary-standard",
  activityType: "vocabulary",
  displayName: "Vocabulary Standard",
  description: "Practice a key word with translation and example context.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Basic", "Easy", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.template.js",
    css: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.css",
    meta: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.meta.js"
  }
};
