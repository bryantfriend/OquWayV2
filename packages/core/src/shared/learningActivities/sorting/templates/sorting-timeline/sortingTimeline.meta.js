export const sortingTimelineMeta = {
  templateId: "sorting-timeline",
  activityType: "sorting",
  displayName: "Timeline Sort",
  description: "A sorting activity shell backed by the drag-match player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "drag", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.template.js",
    css: "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.css",
    meta: "packages/core/src/shared/learningActivities/sorting/templates/sorting-timeline/sortingTimeline.meta.js"
  }
};
