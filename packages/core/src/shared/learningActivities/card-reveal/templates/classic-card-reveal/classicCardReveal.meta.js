export const classicCardRevealMeta = {
  templateId: "classic-card-reveal",
  activityType: "cardReveal",
  displayName: "Classic Card Reveal",
  description: "A quiet flashcard-style reveal layout for direct vocabulary and concept checks.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["stacked cards", "tap reveal", "minimal motion", "high contrast text"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/classic-card-reveal/classicCardReveal.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/classic-card-reveal/classicCardReveal.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/classic-card-reveal/classicCardReveal.meta.js"
  }
};
