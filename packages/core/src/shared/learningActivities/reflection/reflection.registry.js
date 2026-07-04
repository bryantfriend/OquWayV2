import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { ReflectionStep } from "../../stepTypes/ReflectionStep.js?v=1.1.225-learning-activity-source-folders";

export const reflectionActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ReflectionStep,
  activityType: "reflection",
  legacyStepType: "reflection",
  displayName: "Reflection",
  description: "Collect a learner reflection, confidence rating, or written response.",
  icon: "fa-regular fa-lightbulb",
  category: "Assessment",
  complexity: "Easy",
  templateId: "reflection-standard",
  templateDisplayName: "Reflection Standard",
  registryFile: "packages/core/src/shared/learningActivities/reflection/reflection.registry.js",
  seedConfig: {
      "question": "How confident do you feel about this skill?",
      "responseType": "scale",
      "minWords": 0
  }
});
