export const reflectionStandardMeta = {
  templateId: "reflection-standard",
  activityType: "reflection",
  displayName: "Reflection Standard",
  description: "Collect a learner reflection, confidence rating, or written response.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Assessment", "Easy", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/reflection/templates/reflection-standard/reflectionStandard.template.js",
    css: "packages/core/src/shared/learningActivities/reflection/templates/reflection-standard/reflectionStandard.css",
    meta: "packages/core/src/shared/learningActivities/reflection/templates/reflection-standard/reflectionStandard.meta.js"
  }
};
