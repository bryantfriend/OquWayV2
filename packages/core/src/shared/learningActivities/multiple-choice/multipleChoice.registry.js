import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";
import { multipleChoiceSchema } from "./multipleChoice.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { multipleChoiceStandardMeta } from "./templates/multiple-choice-standard/multipleChoiceStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multipleChoiceStandardTemplate from "./templates/multiple-choice-standard/multipleChoiceStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multipleChoiceScenarioMeta } from "./templates/multiple-choice-scenario/multipleChoiceScenario.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multipleChoiceScenarioTemplate from "./templates/multiple-choice-scenario/multipleChoiceScenario.template.js?v=1.1.228-learning-activity-drag-interactions";
import { multipleChoiceCheckpointMeta } from "./templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as multipleChoiceCheckpointTemplate from "./templates/multiple-choice-checkpoint/multipleChoiceCheckpoint.template.js?v=1.1.228-learning-activity-drag-interactions";

export const multipleChoiceActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "multiple-choice",
  legacyStepType: "customExperience",
  displayName: "Multiple Choice",
  description: "A single-choice activity shell backed by the custom experience player.",
  icon: "fa-regular fa-circle-dot",
  category: "Quiz",
  complexity: "Easy",
  templateId: "multiple-choice-standard",
  templateDisplayName: "Quick Choice",
  registryFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.schema.js",
  schema: multipleChoiceSchema,
  templates: [
    {
      meta: multipleChoiceStandardMeta,
      module: multipleChoiceStandardTemplate
    },
    {
      meta: multipleChoiceScenarioMeta,
      module: multipleChoiceScenarioTemplate
    },
    {
      meta: multipleChoiceCheckpointMeta,
      module: multipleChoiceCheckpointTemplate
    }
  ]
});
