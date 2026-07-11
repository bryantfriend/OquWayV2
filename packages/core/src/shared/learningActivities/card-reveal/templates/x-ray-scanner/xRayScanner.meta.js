export const xRayScannerMeta = {
  templateId: "x-ray-scanner",
  activityType: "cardReveal",
  displayName: "X-Ray Scanner",
  description: "Students move a scanner across an object to reveal hidden parts and inspect each layer.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["drag scanner", "hidden layers", "object inspection", "hardware reveal"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/x-ray-scanner/xRayScanner.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/x-ray-scanner/xRayScanner.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/x-ray-scanner/xRayScanner.meta.js"
  }
};
