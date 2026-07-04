import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.225-learning-activity-source-folders";

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
  seedConfig: {
      "title": "Sort the Ideas",
      "subtitle": "Move each item to the best matching place.",
      "items": "Example 1\nExample 2\nExample 3\nExample 4",
      "theme": "sunny"
  }
});
