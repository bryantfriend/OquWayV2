import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { ExternalTaskStep } from "../../stepTypes/ExternalTaskStep.js?v=1.1.226-learning-activity-files";
import { externalTaskSchema } from "./externalTask.schema.js?v=1.1.226-learning-activity-files";
import { externalTaskStandardMeta } from "./templates/external-task-standard/externalTaskStandard.meta.js?v=1.1.226-learning-activity-files";
import * as externalTaskStandardTemplate from "./templates/external-task-standard/externalTaskStandard.template.js?v=1.1.226-learning-activity-files";

export const externalTaskActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ExternalTaskStep,
  activityType: "externalTask",
  legacyStepType: "externalTask",
  displayName: "External Task",
  description: "Assign work outside the player and collect proof for review.",
  icon: "fa-solid fa-upload",
  category: "Assessment",
  complexity: "Medium",
  templateId: "externalTask-standard",
  templateDisplayName: "External Task Standard",
  registryFile: "packages/core/src/shared/learningActivities/external-task/externalTask.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/external-task/externalTask.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/external-task/externalTask.schema.js",
  schema: externalTaskSchema,
  templates: [
    {
      meta: externalTaskStandardMeta,
      module: externalTaskStandardTemplate
    }
  ]
});
