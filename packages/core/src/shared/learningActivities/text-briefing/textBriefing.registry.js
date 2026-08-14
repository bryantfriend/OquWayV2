import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.231-platform-performance-release";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.231-platform-performance-release";
import { textBriefingSchema } from "./textBriefing.schema.js?v=1.1.231-platform-performance-release";
import { textBriefingStandardMeta } from "./templates/text-briefing-standard/textBriefingStandard.meta.js?v=1.1.231-platform-performance-release";
import * as textBriefingStandardTemplate from "./templates/text-briefing-standard/textBriefingStandard.template.js?v=1.1.231-platform-performance-release";
import { textBriefingConceptSpotlightMeta } from "./templates/text-briefing-concept-spotlight/textBriefingConceptSpotlight.meta.js?v=1.1.231-platform-performance-release";
import * as textBriefingConceptSpotlightTemplate from "./templates/text-briefing-concept-spotlight/textBriefingConceptSpotlight.template.js?v=1.1.231-platform-performance-release";
import { textBriefingGuidedCheckpointMeta } from "./templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.meta.js?v=1.1.231-platform-performance-release";
import * as textBriefingGuidedCheckpointTemplate from "./templates/text-briefing-guided-checkpoint/textBriefingGuidedCheckpoint.template.js?v=1.1.231-platform-performance-release";
import { textBriefingDetectiveFileMeta } from "./templates/text-briefing-detective-file/textBriefingDetectiveFile.meta.js?v=1.1.231-platform-performance-release";
import * as textBriefingDetectiveFileTemplate from "./templates/text-briefing-detective-file/textBriefingDetectiveFile.template.js?v=1.1.231-platform-performance-release";
import { textBriefingMapTourMeta } from "./templates/text-briefing-map-tour/textBriefingMapTour.meta.js?v=1.1.231-platform-performance-release";
import * as textBriefingMapTourTemplate from "./templates/text-briefing-map-tour/textBriefingMapTour.template.js?v=1.1.231-platform-performance-release";

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
    },
    {
      meta: textBriefingDetectiveFileMeta,
      module: textBriefingDetectiveFileTemplate
    },
    {
      meta: textBriefingMapTourMeta,
      module: textBriefingMapTourTemplate
    }
  ]
});
