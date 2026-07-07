export const roadmapStandardMeta = {
  templateId: "roadmap-standard",
  activityType: "roadmap",
  displayName: "Learning Roadmap",
  description: "A roadmap activity shell for multi-step learning paths.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.template.js",
    css: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.css",
    meta: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.meta.js"
  }
};
