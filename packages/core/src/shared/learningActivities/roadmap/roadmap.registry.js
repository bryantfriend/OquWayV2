import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { roadmapSchema } from "./roadmap.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { roadmapStandardMeta } from "./templates/roadmap-standard/roadmapStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as roadmapStandardTemplate from "./templates/roadmap-standard/roadmapStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { roadmapSkillClimbMeta } from "./templates/roadmap-skill-climb/roadmapSkillClimb.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as roadmapSkillClimbTemplate from "./templates/roadmap-skill-climb/roadmapSkillClimb.template.js?v=1.1.228-learning-activity-drag-interactions";
import { roadmapProjectLaneMeta } from "./templates/roadmap-project-lane/roadmapProjectLane.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as roadmapProjectLaneTemplate from "./templates/roadmap-project-lane/roadmapProjectLane.template.js?v=1.1.228-learning-activity-drag-interactions";

export const roadmapActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "roadmap",
  legacyStepType: "customExperience",
  displayName: "Roadmap",
  description: "A roadmap activity shell for multi-step learning paths.",
  icon: "fa-solid fa-route",
  category: "Planning",
  complexity: "Medium",
  templateId: "roadmap-standard",
  templateDisplayName: "Learning Roadmap",
  registryFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/roadmap/roadmap.schema.js",
  schema: roadmapSchema,
  templates: [
    {
      meta: roadmapStandardMeta,
      module: roadmapStandardTemplate
    },
    {
      meta: roadmapSkillClimbMeta,
      module: roadmapSkillClimbTemplate
    },
    {
      meta: roadmapProjectLaneMeta,
      module: roadmapProjectLaneTemplate
    }
  ]
});
