export const customExperienceStandardMeta = {
  templateId: "customExperience-standard",
  activityType: "customExperience",
  displayName: "Studio Card",
  description: "A flexible shell for specialized interactive learning experiences.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["studio-card", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-standard/customExperienceStandard.template.js",
    css: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-standard/customExperienceStandard.css",
    meta: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-standard/customExperienceStandard.meta.js"
  }
};
