import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";
import { multiSelectSchema } from "./multiSelect.schema.js?v=1.1.226-learning-activity-files";
import { multiSelectStandardMeta } from "./templates/multi-select-standard/multiSelectStandard.meta.js?v=1.1.226-learning-activity-files";
import * as multiSelectStandardTemplate from "./templates/multi-select-standard/multiSelectStandard.template.js?v=1.1.226-learning-activity-files";

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
  activityFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/multi-select/multiSelect.schema.js",
  schema: multiSelectSchema,
  templates: [
    {
      meta: multiSelectStandardMeta,
      module: multiSelectStandardTemplate
    }
  ]
});
