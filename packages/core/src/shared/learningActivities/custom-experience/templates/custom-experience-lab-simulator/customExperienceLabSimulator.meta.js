export const customExperienceLabSimulatorMeta = {
  templateId: "customExperience-lab-simulator",
  activityType: "customExperience",
  displayName: "Lab Simulator",
  description: "A flexible shell for specialized interactive learning experiences.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["field-lab", "choice", "Medium"],
  files: {
    template: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-lab-simulator/customExperienceLabSimulator.template.js",
    css: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-lab-simulator/customExperienceLabSimulator.css",
    meta: "packages/core/src/shared/learningActivities/custom-experience/templates/custom-experience-lab-simulator/customExperienceLabSimulator.meta.js"
  }
};
