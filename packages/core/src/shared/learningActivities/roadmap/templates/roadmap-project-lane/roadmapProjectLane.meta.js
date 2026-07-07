export const roadmapProjectLaneMeta = {
  templateId: "roadmap-project-lane",
  activityType: "roadmap",
  displayName: "Project Lane",
  description: "A roadmap activity shell for multi-step learning paths.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-project-lane/roadmapProjectLane.template.js",
    css: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-project-lane/roadmapProjectLane.css",
    meta: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-project-lane/roadmapProjectLane.meta.js"
  }
};
