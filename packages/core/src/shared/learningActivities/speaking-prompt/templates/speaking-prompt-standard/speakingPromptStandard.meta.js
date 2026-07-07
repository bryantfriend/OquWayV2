export const speakingPromptStandardMeta = {
  templateId: "speakingPrompt-standard",
  activityType: "speakingPrompt",
  displayName: "Quick Speak",
  description: "A speaking prompt shell without recording.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "text", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.template.js",
    css: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.css",
    meta: "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.meta.js"
  }
};
