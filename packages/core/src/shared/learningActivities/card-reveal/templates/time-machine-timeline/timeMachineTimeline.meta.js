export const timeMachineTimelineMeta = {
  templateId: "time-machine-timeline",
  activityType: "cardReveal",
  displayName: "Time Machine Timeline",
  description: "Students unlock chronological events one by one, revealing a sequence through time.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["cards.front", "cards.back"],
  visualFeatures: ["timeline unlock", "chronological path", "milestone reveal", "history mode"],
  files: {
    template: "packages/core/src/shared/learningActivities/card-reveal/templates/time-machine-timeline/timeMachineTimeline.template.js",
    css: "packages/core/src/shared/learningActivities/card-reveal/templates/time-machine-timeline/timeMachineTimeline.css",
    meta: "packages/core/src/shared/learningActivities/card-reveal/templates/time-machine-timeline/timeMachineTimeline.meta.js"
  }
};
