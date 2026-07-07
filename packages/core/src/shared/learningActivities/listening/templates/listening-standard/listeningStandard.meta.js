export const listeningStandardMeta = {
  templateId: "listening-standard",
  activityType: "listening",
  displayName: "Listen and Check",
  description: "A listening challenge shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "media", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.template.js",
    css: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.css",
    meta: "packages/core/src/shared/learningActivities/listening/templates/listening-standard/listeningStandard.meta.js"
  }
};
