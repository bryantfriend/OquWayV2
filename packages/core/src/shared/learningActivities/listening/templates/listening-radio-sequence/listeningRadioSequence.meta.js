export const listeningRadioSequenceMeta = {
  templateId: "listening-radio-sequence",
  activityType: "listening",
  displayName: "Radio Sequence",
  description: "Radio Sequence turns Listening into a timeline unlock mini-game.",
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
  "template": "packages/core/src/shared/learningActivities/listening/templates/listening-radio-sequence/listeningRadioSequence.template.js",
  "css": "packages/core/src/shared/learningActivities/listening/templates/listening-radio-sequence/listeningRadioSequence.css",
  "meta": "packages/core/src/shared/learningActivities/listening/templates/listening-radio-sequence/listeningRadioSequence.meta.js"
}
};
