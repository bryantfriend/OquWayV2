export const phraseResponseRadarMeta = {
  templateId: "phrase-response-radar",
  activityType: "phrase",
  displayName: "Response Radar",
  description: "Response Radar turns Phrase into a scanner grid mini-game.",
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
  "template": "packages/core/src/shared/learningActivities/phrase/templates/phrase-response-radar/phraseResponseRadar.template.js",
  "css": "packages/core/src/shared/learningActivities/phrase/templates/phrase-response-radar/phraseResponseRadar.css",
  "meta": "packages/core/src/shared/learningActivities/phrase/templates/phrase-response-radar/phraseResponseRadar.meta.js"
}
};
