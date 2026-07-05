import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";
import { roadmapSchema } from "./roadmap.schema.js?v=1.1.226-learning-activity-files";
import { roadmapStandardMeta } from "./templates/roadmap-standard/roadmapStandard.meta.js?v=1.1.226-learning-activity-files";
import * as roadmapStandardTemplate from "./templates/roadmap-standard/roadmapStandard.template.js?v=1.1.226-learning-activity-files";

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
  activityFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.schema.js",
  schema: roadmapSchema,
  templates: [
    {
      meta: roadmapStandardMeta,
      module: roadmapStandardTemplate
    }
  ]
});
