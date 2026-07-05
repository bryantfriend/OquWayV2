import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.226-learning-activity-files";
import { dragMatchIslandSchema } from "./dragMatchIsland.schema.js?v=1.1.226-learning-activity-files";
import { dragMatchIslandStandardMeta } from "./templates/drag-match-island-standard/dragMatchIslandStandard.meta.js?v=1.1.226-learning-activity-files";
import * as dragMatchIslandStandardTemplate from "./templates/drag-match-island-standard/dragMatchIslandStandard.template.js?v=1.1.226-learning-activity-files";

export const dragMatchIslandActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: DragMatchIslandStep,
  activityType: "dragMatchIsland",
  legacyStepType: "dragMatchIsland",
  displayName: "Drag Match Island",
  description: "A playful matching shell for arranging cards or concepts.",
  icon: "fa-solid fa-gamepad",
  category: "Games",
  complexity: "Medium",
  templateId: "dragMatchIsland-standard",
  templateDisplayName: "Drag Match Island Standard",
  registryFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/drag-match-island/dragMatchIsland.schema.js",
  schema: dragMatchIslandSchema,
  templates: [
    {
      meta: dragMatchIslandStandardMeta,
      module: dragMatchIslandStandardTemplate
    }
  ]
});
