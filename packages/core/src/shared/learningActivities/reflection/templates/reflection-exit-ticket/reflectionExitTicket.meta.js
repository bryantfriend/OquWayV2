export const reflectionExitTicketMeta = {
  templateId: "reflection-exit-ticket",
  activityType: "reflection",
  displayName: "Exit Ticket",
  description: "A confidence reflection shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "text", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/reflection/templates/reflection-exit-ticket/reflectionExitTicket.template.js",
    css: "packages/core/src/shared/learningActivities/reflection/templates/reflection-exit-ticket/reflectionExitTicket.css",
    meta: "packages/core/src/shared/learningActivities/reflection/templates/reflection-exit-ticket/reflectionExitTicket.meta.js"
  }
};
