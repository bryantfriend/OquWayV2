export const detectiveBoardMeta = {
  templateId: "detective-board",
  activityType: "cardReveal",
  displayName: "Detective Investigation Board",
  description: "Students inspect clues on an evidence board, then connect the case after all clues are revealed.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["evidence board", "clue inspection", "case conclusion", "critical thinking"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/detective-board/detectiveBoard.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/detective-board/detectiveBoard.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/detective-board/detectiveBoard.meta.js"
  }
};
