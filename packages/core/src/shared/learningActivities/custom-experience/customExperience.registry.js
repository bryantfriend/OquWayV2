import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.225-learning-activity-source-folders";

export const customExperienceActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "customExperience",
  legacyStepType: "customExperience",
  displayName: "Custom Experience",
  description: "A flexible shell for specialized interactive learning experiences.",
  icon: "fa-solid fa-wand-magic-sparkles",
  category: "Custom",
  complexity: "Medium",
  templateId: "customExperience-standard",
  templateDisplayName: "Custom Experience Standard",
  registryFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.registry.js",
  seedConfig: {
      "experienceType": "interactive-shell",
      "title": "Custom Learning Experience",
      "theme": "studio",
      "instructions": "Use this shell to prototype a specialized activity.",
      "data": "{\"mode\":\"preview\"}"
  }
});
