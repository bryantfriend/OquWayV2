import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";
import { customExperienceSchema } from "./customExperience.schema.js?v=1.1.226-learning-activity-files";
import { customExperienceStandardMeta } from "./templates/custom-experience-standard/customExperienceStandard.meta.js?v=1.1.226-learning-activity-files";
import * as customExperienceStandardTemplate from "./templates/custom-experience-standard/customExperienceStandard.template.js?v=1.1.226-learning-activity-files";

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
  activityFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.schema.js",
  schema: customExperienceSchema,
  templates: [
    {
      meta: customExperienceStandardMeta,
      module: customExperienceStandardTemplate
    }
  ]
});
