import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.225-learning-activity-source-folders";

export const roadmapActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "roadmap",
  legacyStepType: "customExperience",
  displayName: "Roadmap",
  description: "Show a learning path or sequence using the custom experience shell.",
  icon: "fa-solid fa-route",
  category: "Custom",
  complexity: "Medium",
  templateId: "roadmap-standard",
  templateDisplayName: "Roadmap Standard",
  registryFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.registry.js",
  seedConfig: {
      "experienceType": "roadmap",
      "title": "Learning Roadmap",
      "theme": "pathway",
      "instructions": "Review the checkpoints before you continue.",
      "data": "{\"checkpoints\":[\"Start\",\"Practice\",\"Apply\"]}"
  }
});
