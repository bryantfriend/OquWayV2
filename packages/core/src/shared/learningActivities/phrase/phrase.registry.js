import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { PhraseStep } from "../../stepTypes/PhraseStep.js?v=1.1.226-learning-activity-files";
import { phraseSchema } from "./phrase.schema.js?v=1.1.226-learning-activity-files";
import { phraseStandardMeta } from "./templates/phrase-standard/phraseStandard.meta.js?v=1.1.226-learning-activity-files";
import * as phraseStandardTemplate from "./templates/phrase-standard/phraseStandard.template.js?v=1.1.226-learning-activity-files";

export const phraseActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: PhraseStep,
  activityType: "phrase",
  legacyStepType: "phrase",
  displayName: "Phrase",
  description: "Practice a useful phrase with meaning and usage support.",
  icon: "fa-solid fa-comments",
  category: "Basic",
  complexity: "Easy",
  templateId: "phrase-standard",
  templateDisplayName: "Phrase Standard",
  registryFile: "packages/core/src/shared/learningActivities/phrase/phrase.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/phrase/phrase.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/phrase/phrase.schema.js",
  schema: phraseSchema,
  templates: [
    {
      meta: phraseStandardMeta,
      module: phraseStandardTemplate
    }
  ]
});
