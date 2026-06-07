import { createDefaultLearningContent, readTemplateSpecs } from "../moduleEditor/learningArchitecture.js?v=1.1.119-student-dashboard-debug-safe";

export function processOpenCreateModuleWizard(executionState) {
  var payload = executionState.payload || {};

  executionState.result = {
    courseId: payload.courseId || null,
    step: "basics",
    defaults: {
      title: "",
      description: "",
      subject: "",
      topic: "",
      level: "",
      estimatedMinutes: 15,
      language: "en",
      templateKey: "school",
      generateStarterSteps: true,
      learningContent: createDefaultLearningContent()
    },
    templates: [
      createTemplate("school", "School", "Primary + Review modes for classroom course flow."),
      createTemplate("educationCenter", "Education Center", "A focused primary path for guided center work."),
      createTemplate("intensive", "Intensive", "Primary, Review, Practice, and Assessment modes."),
      createTemplate("custom", "Custom", "Start light and add modes later.")
    ]
  };

  return { valid: true };
}

function createTemplate(key, label, description) {
  return {
    key: key,
    label: label,
    description: description,
    modes: readTemplateSpecs(key)
  };
}
