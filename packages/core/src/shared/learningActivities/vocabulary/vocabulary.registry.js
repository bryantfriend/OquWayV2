import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { VocabularyStep } from "../../stepTypes/VocabularyStep.js?v=1.1.226-learning-activity-files";
import { vocabularySchema } from "./vocabulary.schema.js?v=1.1.226-learning-activity-files";
import { vocabularyStandardMeta } from "./templates/vocabulary-standard/vocabularyStandard.meta.js?v=1.1.226-learning-activity-files";
import * as vocabularyStandardTemplate from "./templates/vocabulary-standard/vocabularyStandard.template.js?v=1.1.226-learning-activity-files";

export const vocabularyActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: VocabularyStep,
  activityType: "vocabulary",
  legacyStepType: "vocabulary",
  displayName: "Vocabulary",
  description: "Practice a key word with translation and example context.",
  icon: "fa-solid fa-book",
  category: "Basic",
  complexity: "Easy",
  templateId: "vocabulary-standard",
  templateDisplayName: "Vocabulary Standard",
  registryFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.schema.js",
  schema: vocabularySchema,
  templates: [
    {
      meta: vocabularyStandardMeta,
      module: vocabularyStandardTemplate
    }
  ]
});
