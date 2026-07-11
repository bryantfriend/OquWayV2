import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandSchema } from "./dragMatchIsland.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandStandardMeta } from "./templates/drag-match-island-standard/dragMatchIslandStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as dragMatchIslandStandardTemplate from "./templates/drag-match-island-standard/dragMatchIslandStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandHarborPairsMeta } from "./templates/drag-match-island-harbor-pairs/dragMatchIslandHarborPairs.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as dragMatchIslandHarborPairsTemplate from "./templates/drag-match-island-harbor-pairs/dragMatchIslandHarborPairs.template.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandTreasureSortMeta } from "./templates/drag-match-island-treasure-sort/dragMatchIslandTreasureSort.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as dragMatchIslandTreasureSortTemplate from "./templates/drag-match-island-treasure-sort/dragMatchIslandTreasureSort.template.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandBridgeBuilderMeta } from "./templates/drag-match-island-bridge-builder/dragMatchIslandBridgeBuilder.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as dragMatchIslandBridgeBuilderTemplate from "./templates/drag-match-island-bridge-builder/dragMatchIslandBridgeBuilder.template.js?v=1.1.228-learning-activity-drag-interactions";
import { dragMatchIslandRescueRadarMeta } from "./templates/drag-match-island-rescue-radar/dragMatchIslandRescueRadar.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as dragMatchIslandRescueRadarTemplate from "./templates/drag-match-island-rescue-radar/dragMatchIslandRescueRadar.template.js?v=1.1.228-learning-activity-drag-interactions";

export const dragMatchIslandActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: DragMatchIslandStep,
  activityType: "dragMatchIsland",
  legacyStepType: "dragMatchIsland",
  displayName: "Drag Match Island",
  description: "A playful island shell for matching and sorting challenges.",
  icon: "fa-solid fa-gamepad",
  category: "Games",
  complexity: "Medium",
  templateId: "dragMatchIsland-standard",
  templateDisplayName: "Island Match",
  registryFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.schema.js",
  schema: dragMatchIslandSchema,
  templates: [
    {
      meta: dragMatchIslandStandardMeta,
      module: dragMatchIslandStandardTemplate
    },
    {
      meta: dragMatchIslandHarborPairsMeta,
      module: dragMatchIslandHarborPairsTemplate
    },
    {
      meta: dragMatchIslandTreasureSortMeta,
      module: dragMatchIslandTreasureSortTemplate
    },
    {
      meta: dragMatchIslandBridgeBuilderMeta,
      module: dragMatchIslandBridgeBuilderTemplate
    },
    {
      meta: dragMatchIslandRescueRadarMeta,
      module: dragMatchIslandRescueRadarTemplate
    }
  ]
});
