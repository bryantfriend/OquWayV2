import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.226-learning-activity-files";
import { sortingSchema } from "./sorting.schema.js?v=1.1.226-learning-activity-files";
import { sortingStandardMeta } from "./templates/sorting-standard/sortingStandard.meta.js?v=1.1.226-learning-activity-files";
import * as sortingStandardTemplate from "./templates/sorting-standard/sortingStandard.template.js?v=1.1.226-learning-activity-files";

export const sortingActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: DragMatchIslandStep,
  activityType: "sorting",
  legacyStepType: "dragMatchIsland",
  displayName: "Sorting",
  description: "Sort or match items using the existing drag-match activity engine.",
  icon: "fa-solid fa-arrow-down-a-z",
  category: "Games",
  complexity: "Medium",
  templateId: "sorting-standard",
  templateDisplayName: "Sorting Standard",
  registryFile: "packages/core/src/shared/learningActivities/sorting/sorting.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/sorting/sorting.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/sorting/sorting.schema.js",
  schema: sortingSchema,
  templates: [
    {
      meta: sortingStandardMeta,
      module: sortingStandardTemplate
    }
  ]
});
