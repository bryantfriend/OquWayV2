export const listeningStandardMeta = {
  templateId: "listening-standard",
  activityType: "listening",
  displayName: "Listening Standard",
  description: "Guide learners through a listening prompt or transcript-based check.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Media", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.template.js",
    css: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.css",
    meta: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.meta.js"
  }
};
