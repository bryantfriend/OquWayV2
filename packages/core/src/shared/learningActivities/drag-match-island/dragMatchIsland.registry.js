import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.225-learning-activity-source-folders";

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
  seedConfig: {
      "title": "Input Device Island",
      "subtitle": "Match each item to the right place.",
      "items": "Keyboard\nMouse\nMonitor\nPrinter",
      "theme": "sunny"
  }
});
