import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.231-platform-performance-release";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.231-platform-performance-release";
import { roadmapSchema } from "./roadmap.schema.js?v=1.1.231-platform-performance-release";
import { roadmapStandardMeta } from "./templates/roadmap-standard/roadmapStandard.meta.js?v=1.1.231-platform-performance-release";
import * as roadmapStandardTemplate from "./templates/roadmap-standard/roadmapStandard.template.js?v=1.1.231-platform-performance-release";
import { roadmapSkillClimbMeta } from "./templates/roadmap-skill-climb/roadmapSkillClimb.meta.js?v=1.1.231-platform-performance-release";
import * as roadmapSkillClimbTemplate from "./templates/roadmap-skill-climb/roadmapSkillClimb.template.js?v=1.1.231-platform-performance-release";
import { roadmapProjectLaneMeta } from "./templates/roadmap-project-lane/roadmapProjectLane.meta.js?v=1.1.231-platform-performance-release";
import * as roadmapProjectLaneTemplate from "./templates/roadmap-project-lane/roadmapProjectLane.template.js?v=1.1.231-platform-performance-release";
import { roadmapBossPathMeta } from "./templates/roadmap-boss-path/roadmapBossPath.meta.js?v=1.1.231-platform-performance-release";
import * as roadmapBossPathTemplate from "./templates/roadmap-boss-path/roadmapBossPath.template.js?v=1.1.231-platform-performance-release";
import { roadmapMapTourMeta } from "./templates/roadmap-map-tour/roadmapMapTour.meta.js?v=1.1.231-platform-performance-release";
import * as roadmapMapTourTemplate from "./templates/roadmap-map-tour/roadmapMapTour.template.js?v=1.1.231-platform-performance-release";

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
    },
    {
      meta: roadmapBossPathMeta,
      module: roadmapBossPathTemplate
    },
    {
      meta: roadmapMapTourMeta,
      module: roadmapMapTourTemplate
    }
  ]
});
