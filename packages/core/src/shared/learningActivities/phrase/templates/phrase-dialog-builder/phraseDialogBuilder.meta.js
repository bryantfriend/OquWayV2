export const phraseDialogBuilderMeta = {
  templateId: "phrase-dialog-builder",
  activityType: "phrase",
  displayName: "Dialog Builder",
  description: "A useful phrase practice shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.template.js",
    css: "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.css",
    meta: "packages/core/src/shared/learningActivities/phrase/templates/phrase-dialog-builder/phraseDialogBuilder.meta.js"
  }
};
