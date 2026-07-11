export const phraseComicStripMeta = {
  templateId: "phrase-comic-strip",
  activityType: "phrase",
  displayName: "Comic Strip",
  description: "Comic Strip turns Phrase into a timeline unlock mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "timeline-unlock",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/phrase/templates/phrase-comic-strip/phraseComicStrip.template.js",
  "css": "packages/core/src/shared/learningActivities/phrase/templates/phrase-comic-strip/phraseComicStrip.css",
  "meta": "packages/core/src/shared/learningActivities/phrase/templates/phrase-comic-strip/phraseComicStrip.meta.js"
}
};
