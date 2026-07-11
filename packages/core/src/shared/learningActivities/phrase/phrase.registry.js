import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { PhraseStep } from "../../stepTypes/PhraseStep.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseSchema } from "./phrase.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseStandardMeta } from "./templates/phrase-standard/phraseStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as phraseStandardTemplate from "./templates/phrase-standard/phraseStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseDialogBuilderMeta } from "./templates/phrase-dialog-builder/phraseDialogBuilder.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as phraseDialogBuilderTemplate from "./templates/phrase-dialog-builder/phraseDialogBuilder.template.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseConfidenceRepeatMeta } from "./templates/phrase-confidence-repeat/phraseConfidenceRepeat.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as phraseConfidenceRepeatTemplate from "./templates/phrase-confidence-repeat/phraseConfidenceRepeat.template.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseComicStripMeta } from "./templates/phrase-comic-strip/phraseComicStrip.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as phraseComicStripTemplate from "./templates/phrase-comic-strip/phraseComicStrip.template.js?v=1.1.228-learning-activity-drag-interactions";
import { phraseResponseRadarMeta } from "./templates/phrase-response-radar/phraseResponseRadar.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as phraseResponseRadarTemplate from "./templates/phrase-response-radar/phraseResponseRadar.template.js?v=1.1.228-learning-activity-drag-interactions";

export const phraseActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: PhraseStep,
  activityType: "phrase",
  legacyStepType: "phrase",
  displayName: "Phrase",
  description: "A useful phrase practice shell.",
  icon: "fa-solid fa-comments",
  category: "Basic",
  complexity: "Easy",
  templateId: "phrase-standard",
  templateDisplayName: "Phrase Card",
  registryFile: "packages/core/src/shared/learningActivities/phrase/phrase.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/phrase/phrase.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/phrase/phrase.schema.js",
  schema: phraseSchema,
  templates: [
    {
      meta: phraseStandardMeta,
      module: phraseStandardTemplate
    },
    {
      meta: phraseDialogBuilderMeta,
      module: phraseDialogBuilderTemplate
    },
    {
      meta: phraseConfidenceRepeatMeta,
      module: phraseConfidenceRepeatTemplate
    },
    {
      meta: phraseComicStripMeta,
      module: phraseComicStripTemplate
    },
    {
      meta: phraseResponseRadarMeta,
      module: phraseResponseRadarTemplate
    }
  ]
});
