export const listeningEchoResponseMeta = {
  templateId: "listening-echo-response",
  activityType: "listening",
  displayName: "Echo Response",
  description: "A listening challenge shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "media", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/listening/templates/listening-echo-response/listeningEchoResponse.template.js",
    css: "packages/core/src/shared/learningActivities/listening/templates/listening-echo-response/listeningEchoResponse.css",
    meta: "packages/core/src/shared/learningActivities/listening/templates/listening-echo-response/listeningEchoResponse.meta.js"
  }
};
