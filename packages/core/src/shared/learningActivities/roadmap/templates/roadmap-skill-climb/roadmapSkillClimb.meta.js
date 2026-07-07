export const roadmapSkillClimbMeta = {
  templateId: "roadmap-skill-climb",
  activityType: "roadmap",
  displayName: "Skill Climb",
  description: "A roadmap activity shell for multi-step learning paths.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["skill-sprint", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-skill-climb/roadmapSkillClimb.template.js",
    css: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-skill-climb/roadmapSkillClimb.css",
    meta: "packages/core/src/shared/learningActivities/roadmap/templates/roadmap-skill-climb/roadmapSkillClimb.meta.js"
  }
};
