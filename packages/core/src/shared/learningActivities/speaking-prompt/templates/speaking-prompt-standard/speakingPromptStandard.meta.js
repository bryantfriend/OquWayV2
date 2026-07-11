export const speakingPromptStandardMeta = {
  templateId: "speakingPrompt-standard",
  activityType: "speakingPrompt",
  displayName: "Quick Speak",
  description: "Quick Speak turns Speaking Prompt into a mood meter mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "mood-meter",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.template.js",
  "css": "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.css",
  "meta": "packages/core/src/shared/learningActivities/speaking-prompt/templates/speaking-prompt-standard/speakingPromptStandard.meta.js"
}
};
