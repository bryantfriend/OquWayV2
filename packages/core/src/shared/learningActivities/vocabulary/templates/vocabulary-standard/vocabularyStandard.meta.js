export const vocabularyStandardMeta = {
  templateId: "vocabulary-standard",
  activityType: "vocabulary",
  displayName: "Flip Word Card",
  description: "A vocabulary review shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "media", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.template.js",
    css: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.css",
    meta: "packages/core/src/shared/learningActivities/vocabulary/templates/vocabulary-standard/vocabularyStandard.meta.js"
  }
};
