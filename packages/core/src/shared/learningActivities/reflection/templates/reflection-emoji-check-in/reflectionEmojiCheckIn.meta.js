export const reflectionEmojiCheckInMeta = {
  templateId: "reflection-emoji-check-in",
  activityType: "reflection",
  displayName: "Emoji Check-In",
  description: "Students choose an emoji that represents how they feel, then add a short reason.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: ["question", "responseType"],
  visualFeatures: ["emoji choice", "feelings check", "quick reflection", "low-friction exit ticket"],
  files: {
    template: "packages/core/src/shared/learningActivities/reflection/templates/reflection-emoji-check-in/reflectionEmojiCheckIn.template.js",
    css: "packages/core/src/shared/learningActivities/reflection/templates/reflection-emoji-check-in/reflectionEmojiCheckIn.css",
    meta: "packages/core/src/shared/learningActivities/reflection/templates/reflection-emoji-check-in/reflectionEmojiCheckIn.meta.js"
  }
};
