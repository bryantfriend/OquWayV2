export const speakingPromptTimedPitchMeta = {
  templateId: "speakingPrompt-timed-pitch",
  activityType: "speakingPrompt",
  displayName: "Timed Pitch",
  description: "A speaking prompt shell without recording.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "text", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-timed-pitch/speakingPromptTimedPitch.template.js",
    css: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-timed-pitch/speakingPromptTimedPitch.css",
    meta: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-timed-pitch/speakingPromptTimedPitch.meta.js"
  }
};
