import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { ReflectionStep } from "../../stepTypes/ReflectionStep.js?v=1.1.226-learning-activity-files";
import { reflectionSchema } from "./reflection.schema.js?v=1.1.226-learning-activity-files";
import { reflectionStandardMeta } from "./templates/reflection-standard/reflectionStandard.meta.js?v=1.1.226-learning-activity-files";
import * as reflectionStandardTemplate from "./templates/reflection-standard/reflectionStandard.template.js?v=1.1.226-learning-activity-files";

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
  activityFile: "packages/core/src/shared/learningActivities/reflection/reflection.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/reflection/reflection.schema.js",
  schema: reflectionSchema,
  templates: [
    {
      meta: reflectionStandardMeta,
      module: reflectionStandardTemplate
    }
  ]
});
