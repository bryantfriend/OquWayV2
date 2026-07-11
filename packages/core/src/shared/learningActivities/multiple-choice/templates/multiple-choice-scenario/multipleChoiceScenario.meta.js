export const multipleChoiceScenarioMeta = {
  templateId: "multiple-choice-scenario",
  activityType: "multiple-choice",
  displayName: "Scenario Choice",
  description: "Scenario Choice turns Multiple Choice into a quest map mini-game.",
  supportsPreview: true,
  supportsStudentMode: true,
  supportsTeacherPreview: true,
  requiredContentFields: [],
  visualFeatures: [
  "quest-map",
  "distinct-interaction",
  "Easy"
],
  files: {
  "template": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.template.js",
  "css": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.css",
  "meta": "packages/core/src/shared/learningActivities/multiple-choice/templates/multiple-choice-scenario/multipleChoiceScenario.meta.js"
}
};
