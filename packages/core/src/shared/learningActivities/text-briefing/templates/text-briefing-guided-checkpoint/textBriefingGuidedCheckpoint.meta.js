export const textBriefingGuidedCheckpointMeta = {
  templateId: "textBriefing-guided-checkpoint",
  activityType: "textBriefing",
  displayName: "Guided Checkpoint",
  description: "A short reading or explanation step.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/text-briefing/templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.template.js",
    css: "packages/core/src/shared/learningActivities/text-briefing/templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.css",
    meta: "packages/core/src/shared/learningActivities/text-briefing/templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.meta.js"
  }
};
