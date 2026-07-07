export const multipleChoiceStandardMeta = {
  templateId: "multiple-choice-standard",
  activityType: "multiple-choice",
  displayName: "Quick Choice",
  description: "A single-choice activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.template.js",
    css: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.css",
    meta: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.meta.js"
  }
};
