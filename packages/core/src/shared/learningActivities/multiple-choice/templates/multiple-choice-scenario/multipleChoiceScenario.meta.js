export const multipleChoiceScenarioMeta = {
  templateId: "multiple-choice-scenario",
  activityType: "multiple-choice",
  displayName: "Scenario Choice",
  description: "A single-choice activity shell backed by the custom experience player.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: ["story-path", "choice", "Easy"],
  files: {
    template: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.template.js",
    css: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.css",
    meta: "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.meta.js"
  }
};
