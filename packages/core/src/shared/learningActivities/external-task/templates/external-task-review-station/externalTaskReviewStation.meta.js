export const externalTaskReviewStationMeta = {
  templateId: "externalTask-review-station",
  activityType: "externalTask",
  displayName: "Review Station",
  description: "Review Station turns External Task into a evidence board mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "evidence-board",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/external-task/templates/external-task-review-station/externalTaskReviewStation.template.js",
  "css": "packages/core/src/shared/learningActivities/external-task/templates/external-task-review-station/externalTaskReviewStation.css",
  "meta": "packages/core/src/shared/learningActivities/external-task/templates/external-task-review-station/externalTaskReviewStation.meta.js"
}
};
