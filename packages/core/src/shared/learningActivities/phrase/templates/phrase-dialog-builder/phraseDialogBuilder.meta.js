export const phraseDialogBuilderMeta = {
  templateId: "phrase-dialog-builder",
  activityType: "phrase",
  displayName: "Dialog Builder",
  description: "Dialog Builder turns Phrase into a dialog builder mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "dialog-builder",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.template.js",
  "css": "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.css",
  "meta": "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.meta.js"
}
};
