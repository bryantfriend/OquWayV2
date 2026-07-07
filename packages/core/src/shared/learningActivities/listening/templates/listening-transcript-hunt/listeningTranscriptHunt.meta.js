export const listeningTranscriptHuntMeta = {
  templateId: "listening-transcript-hunt",
  activityType: "listening",
  displayName: "Transcript Hunt",
  description: "A listening challenge shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "media", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.template.js",
    css: "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.css",
    meta: "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.meta.js"
  }
};
