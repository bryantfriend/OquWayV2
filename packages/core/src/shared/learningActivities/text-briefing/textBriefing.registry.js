import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.228-learning-activity-drag-interactions";
import { textBriefingSchema } from "./textBriefing.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { textBriefingStandardMeta } from "./templates/text-briefing-standard/textBriefingStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as textBriefingStandardTemplate from "./templates/text-briefing-standard/textBriefingStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { textBriefingConceptSpotlightMeta } from "./templates/text-briefing-concept-spotlight/textBriefingConceptSpotlight.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as textBriefingConceptSpotlightTemplate from "./templates/text-briefing-concept-spotlight/textBriefingConceptSpotlight.template.js?v=1.1.228-learning-activity-drag-interactions";
import { textBriefingGuidedCheckpointMeta } from "./templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as textBriefingGuidedCheckpointTemplate from "./templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.template.js?v=1.1.228-learning-activity-drag-interactions";

export const textBriefingActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "textBriefing",
  legacyStepType: "textBriefing",
  displayName: "Text Briefing",
  description: "A short reading or explanation step.",
  icon: "fa-regular fa-file-lines",
  category: "Basic",
  complexity: "Easy",
  templateId: "textBriefing-standard",
  templateDisplayName: "Briefing Card",
  registryFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.schema.js",
  schema: textBriefingSchema,
  templates: [
    {
      meta: textBriefingStandardMeta,
      module: textBriefingStandardTemplate
    },
    {
      meta: textBriefingConceptSpotlightMeta,
      module: textBriefingConceptSpotlightTemplate
    },
    {
      meta: textBriefingGuidedCheckpointMeta,
      module: textBriefingGuidedCheckpointTemplate
    }
  ]
});
