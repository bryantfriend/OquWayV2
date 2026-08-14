import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.231-platform-performance-release";
import { VocabularyStep } from "../../stepTypes/VocabularyStep.js?v=1.1.231-platform-performance-release";
import { vocabularySchema } from "./vocabulary.schema.js?v=1.1.231-platform-performance-release";
import { vocabularyStandardMeta } from "./templates/vocabulary-standard/vocabularyStandard.meta.js?v=1.1.231-platform-performance-release";
import * as vocabularyStandardTemplate from "./templates/vocabulary-standard/vocabularyStandard.template.js?v=1.1.231-platform-performance-release";
import { vocabularyExampleBuilderMeta } from "./templates/vocabulary-example-builder/vocabularyExampleBuilder.meta.js?v=1.1.231-platform-performance-release";
import * as vocabularyExampleBuilderTemplate from "./templates/vocabulary-example-builder/vocabularyExampleBuilder.template.js?v=1.1.231-platform-performance-release";
import { vocabularyRapidReviewMeta } from "./templates/vocabulary-rapid-review/vocabularyRapidReview.meta.js?v=1.1.231-platform-performance-release";
import * as vocabularyRapidReviewTemplate from "./templates/vocabulary-rapid-review/vocabularyRapidReview.template.js?v=1.1.231-platform-performance-release";
import { vocabularyWordLabMeta } from "./templates/vocabulary-word-lab/vocabularyWordLab.meta.js?v=1.1.231-platform-performance-release";
import * as vocabularyWordLabTemplate from "./templates/vocabulary-word-lab/vocabularyWordLab.template.js?v=1.1.231-platform-performance-release";
import { vocabularyMemoryGridMeta } from "./templates/vocabulary-memory-grid/vocabularyMemoryGrid.meta.js?v=1.1.231-platform-performance-release";
import * as vocabularyMemoryGridTemplate from "./templates/vocabulary-memory-grid/vocabularyMemoryGrid.template.js?v=1.1.231-platform-performance-release";

export const vocabularyActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: VocabularyStep,
  activityType: "vocabulary",
  legacyStepType: "vocabulary",
  displayName: "Vocabulary",
  description: "A vocabulary review shell.",
  icon: "fa-solid fa-book",
  category: "Basic",
  complexity: "Easy",
  templateId: "vocabulary-standard",
  templateDisplayName: "Flip Word Card",
  registryFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.schema.js",
  schema: vocabularySchema,
  templates: [
    {
      meta: vocabularyStandardMeta,
      module: vocabularyStandardTemplate
    },
    {
      meta: vocabularyExampleBuilderMeta,
      module: vocabularyExampleBuilderTemplate
    },
    {
      meta: vocabularyRapidReviewMeta,
      module: vocabularyRapidReviewTemplate
    },
    {
      meta: vocabularyWordLabMeta,
      module: vocabularyWordLabTemplate
    },
    {
      meta: vocabularyMemoryGridMeta,
      module: vocabularyMemoryGridTemplate
    }
  ]
});
