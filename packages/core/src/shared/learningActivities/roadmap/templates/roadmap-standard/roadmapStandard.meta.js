export const roadmapStandardMeta = {
  templateId: "roadmap-standard",
  activityType: "roadmap",
  displayName: "Roadmap Standard",
  description: "Show a learning path or sequence using the custom experience shell.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["Custom", "Medium", "step-type-backed"],
  files: {
    template: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.template.js",
    css: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.css",
    meta: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-standard/roadmapStandard.meta.js"
  }
};
