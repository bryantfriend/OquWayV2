import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.225-learning-activity-source-folders";

export const multipleChoiceActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "multiple-choice",
  legacyStepType: "customExperience",
  displayName: "Multiple Choice",
  description: "Ask learners to choose one answer using the custom activity shell.",
  icon: "fa-regular fa-circle-dot",
  category: "Assessment",
  complexity: "Easy",
  templateId: "multiple-choice-standard",
  templateDisplayName: "Multiple Choice Standard",
  registryFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.registry.js",
  seedConfig: {
      "experienceType": "multiple-choice",
      "title": "Check Your Understanding",
      "theme": "assessment",
      "instructions": "Choose the best answer, then complete the activity.",
      "data": "{\"question\":\"What is the best answer?\",\"choices\":[\"A\",\"B\",\"C\"]}"
  }
});
