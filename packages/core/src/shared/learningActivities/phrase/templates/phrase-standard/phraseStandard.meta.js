export const phraseStandardMeta = {
  templateId: "phrase-standard",
  activityType: "phrase",
  displayName: "Phrase Standard",
  description: "Practice a useful phrase with meaning and usage support.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Basic", "Easy", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/phrase/templates/phrase-standard/phraseStandard.template.js",
    css: "packages/core/src/shared/learningActivities/phrase/templates/phrase-standard/phraseStandard.css",
    meta: "packages/core/src/shared/learningActivities/phrase/templates/phrase-standard/phraseStandard.meta.js"
  }
};
