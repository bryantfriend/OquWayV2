import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingSchema } from "./sorting.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingStandardMeta } from "./templates/sorting-standard/sortingStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as sortingStandardTemplate from "./templates/sorting-standard/sortingStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingCategorySprintMeta } from "./templates/sorting-category-sprint/sortingCategorySprint.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as sortingCategorySprintTemplate from "./templates/sorting-category-sprint/sortingCategorySprint.template.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingTimelineMeta } from "./templates/sorting-timeline/sortingTimeline.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as sortingTimelineTemplate from "./templates/sorting-timeline/sortingTimeline.template.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingRecycleStationMeta } from "./templates/sorting-recycle-station/sortingRecycleStation.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as sortingRecycleStationTemplate from "./templates/sorting-recycle-station/sortingRecycleStation.template.js?v=1.1.228-learning-activity-drag-interactions";
import { sortingMuseumCuratorMeta } from "./templates/sorting-museum-curator/sortingMuseumCurator.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as sortingMuseumCuratorTemplate from "./templates/sorting-museum-curator/sortingMuseumCurator.template.js?v=1.1.228-learning-activity-drag-interactions";

export const sortingActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: DragMatchIslandStep,
  activityType: "sorting",
  legacyStepType: "dragMatchIsland",
  displayName: "Sorting",
  description: "A sorting activity shell backed by the drag-match player.",
  icon: "fa-solid fa-arrow-down-a-z",
  category: "Games",
  complexity: "Medium",
  templateId: "sorting-standard",
  templateDisplayName: "Sort the Set",
  registryFile: "packages/core/src/shared/learningActivities/sorting/sorting.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/sorting/sorting.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/sorting/sorting.schema.js",
  schema: sortingSchema,
  templates: [
    {
      meta: sortingStandardMeta,
      module: sortingStandardTemplate
    },
    {
      meta: sortingCategorySprintMeta,
      module: sortingCategorySprintTemplate
    },
    {
      meta: sortingTimelineMeta,
      module: sortingTimelineTemplate
    },
    {
      meta: sortingRecycleStationMeta,
      module: sortingRecycleStationTemplate
    },
    {
      meta: sortingMuseumCuratorMeta,
      module: sortingMuseumCuratorTemplate
    }
  ]
});
