export const speakingPromptStandardMeta = {
  templateId: "speakingPrompt-standard",
  activityType: "speakingPrompt",
  displayName: "Speaking Prompt Standard",
  description: "Prompt learners to prepare and speak a short response.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Speaking", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.template.js",
    css: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.css",
    meta: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.meta.js"
  }
};
