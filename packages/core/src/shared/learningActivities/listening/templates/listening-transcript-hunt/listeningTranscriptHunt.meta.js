export const listeningTranscriptHuntMeta = {
  templateId: "listening-transcript-hunt",
  activityType: "listening",
  displayName: "Transcript Hunt",
  description: "Transcript Hunt turns Listening into a scanner grid mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "scanner-grid",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.template.js",
  "css": "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.css",
  "meta": "packages/core/src/shared/learningActivities/listening/templates/listening-transcript-hunt/listeningTranscriptHunt.meta.js"
}
};
