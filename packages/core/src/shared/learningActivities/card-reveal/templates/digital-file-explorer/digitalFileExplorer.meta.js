export const digitalFileExplorerMeta = {
  templateId: "digital-file-explorer",
  activityType: "cardReveal",
  displayName: "Digital File Explorer",
  description: "Students browse folders and open files to reveal concepts, built especially for ICT lessons.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["folder browsing", "file opening", "ICT desktop", "completion checks"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/digital-file-explorer/digitalFileExplorer.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/digital-file-explorer/digitalFileExplorer.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/digital-file-explorer/digitalFileExplorer.meta.js"
  }
};
