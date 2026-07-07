export const speedRevealStackMeta = {
  templateId: "speed-reveal-stack",
  activityType: "cardReveal",
  displayName: "Speed Reveal Stack",
  description: "A rapid card reveal template for quick checks.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards"],
  visualFeatures: ["skill-sprint", "reveal", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/speed-reveal-stack/speedRevealStack.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/speed-reveal-stack/speedRevealStack.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/speed-reveal-stack/speedRevealStack.meta.js"
  }
};
