export const mysteryFlipCardsMeta = {
  templateId: "mystery-flip-cards",
  activityType: "cardReveal",
  displayName: "Mystery Flip Cards",
  description: "A playful grid of mystery cards that flip open as learners reveal each answer.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["flip animation", "mystery numbers", "grid layout", "answer reveal"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/mystery-flip-cards/mysteryFlipCards.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/mystery-flip-cards/mysteryFlipCards.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/mystery-flip-cards/mysteryFlipCards.meta.js"
  }
};
