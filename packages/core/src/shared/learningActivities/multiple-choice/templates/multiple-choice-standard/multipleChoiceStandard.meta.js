export const multipleChoiceStandardMeta = {
  templateId: "multiple-choice-standard",
  activityType: "multiple-choice",
  displayName: "Multiple Choice Standard",
  description: "Ask learners to choose one answer using the custom activity shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Assessment", "Easy", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.template.js",
    css: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.css",
    meta: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-standard/multipleChoiceStandard.meta.js"
  }
};
