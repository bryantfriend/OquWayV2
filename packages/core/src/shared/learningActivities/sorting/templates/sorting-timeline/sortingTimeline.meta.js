export const sortingTimelineMeta = {
  templateId: "sorting-timeline",
  activityType: "sorting",
  displayName: "Timeline Sort",
  description: "Timeline Sort turns Sorting into a timeline unlock mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "timeline-unlock",
  "distinct-interaction",
  "Medium"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.template.js",
  "css": "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.css",
  "meta": "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.meta.js"
}
};
