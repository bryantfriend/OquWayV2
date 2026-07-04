import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.225-learning-activity-source-folders";

export const multiSelectActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "multi-select",
  legacyStepType: "customExperience",
  displayName: "Multi Select",
  description: "Ask learners to select more than one answer using the custom activity shell.",
  icon: "fa-regular fa-square-check",
  category: "Assessment",
  complexity: "Medium",
  templateId: "multi-select-standard",
  templateDisplayName: "Multi Select Standard",
  registryFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.registry.js",
  seedConfig: {
      "experienceType": "multi-select",
      "title": "Select All That Apply",
      "theme": "assessment",
      "instructions": "Select every correct option, then complete the activity.",
      "data": "{\"question\":\"Which options apply?\",\"choices\":[\"A\",\"B\",\"C\"]}"
  }
});
