import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { customExperienceSchema } from "./customExperience.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { customExperienceStandardMeta } from "./templates/custom-experience-standard/customExperienceStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as customExperienceStandardTemplate from "./templates/custom-experience-standard/customExperienceStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { customExperienceLabSimulatorMeta } from "./templates/custom-experience-lab-simulator/customExperienceLabSimulator.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as customExperienceLabSimulatorTemplate from "./templates/custom-experience-lab-simulator/customExperienceLabSimulator.template.js?v=1.1.228-learning-activity-drag-interactions";
import { customExperienceQuestHubMeta } from "./templates/custom-experience-quest-hub/customExperienceQuestHub.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as customExperienceQuestHubTemplate from "./templates/custom-experience-quest-hub/customExperienceQuestHub.template.js?v=1.1.228-learning-activity-drag-interactions";

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
  templateDisplayName: "Studio Card",
  registryFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/custom-experience/customExperience.schema.js",
  schema: customExperienceSchema,
  templates: [
    {
      meta: customExperienceStandardMeta,
      module: customExperienceStandardTemplate
    },
    {
      meta: customExperienceLabSimulatorMeta,
      module: customExperienceLabSimulatorTemplate
    },
    {
      meta: customExperienceQuestHubMeta,
      module: customExperienceQuestHubTemplate
    }
  ]
});
