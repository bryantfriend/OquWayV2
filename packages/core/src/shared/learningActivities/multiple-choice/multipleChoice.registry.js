import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";
import { multipleChoiceSchema } from "./multipleChoice.schema.js?v=1.1.226-learning-activity-files";
import { multipleChoiceStandardMeta } from "./templates/multiple-choice-standard/multipleChoiceStandard.meta.js?v=1.1.226-learning-activity-files";
import * as multipleChoiceStandardTemplate from "./templates/multiple-choice-standard/multipleChoiceStandard.template.js?v=1.1.226-learning-activity-files";

export const multipleChoiceActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CustomExperienceStep,
  activityType: "multiple-choice",
  legacyStepType: "customExperience",
  displayName: "Multiple Choice",
  description: "Ask learners to choose one answer using the custom activity shell.",
  icon: "fa-regular fa-circle-dot",
  category: "Assessment",
  complexity: "Easy",
  templateId: "multiple-choice-standard",
  templateDisplayName: "Multiple Choice Standard",
  registryFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/multiple-choice/multipleChoice.schema.js",
  schema: multipleChoiceSchema,
  templates: [
    {
      meta: multipleChoiceStandardMeta,
      module: multipleChoiceStandardTemplate
    }
  ]
});
