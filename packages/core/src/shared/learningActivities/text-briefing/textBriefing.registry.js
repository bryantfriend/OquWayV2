import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.226-learning-activity-files";
import { textBriefingSchema } from "./textBriefing.schema.js?v=1.1.226-learning-activity-files";
import { textBriefingStandardMeta } from "./templates/text-briefing-standard/textBriefingStandard.meta.js?v=1.1.226-learning-activity-files";
import * as textBriefingStandardTemplate from "./templates/text-briefing-standard/textBriefingStandard.template.js?v=1.1.226-learning-activity-files";

export const textBriefingActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "textBriefing",
  legacyStepType: "textBriefing",
  displayName: "Text Briefing",
  description: "A structured reading or instruction card for introducing lesson content.",
  icon: "fa-regular fa-file-lines",
  category: "Basic",
  complexity: "Easy",
  templateId: "textBriefing-standard",
  templateDisplayName: "Text Briefing Standard",
  registryFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/text-briefing/textBriefing.schema.js",
  schema: textBriefingSchema,
  templates: [
    {
      meta: textBriefingStandardMeta,
      module: textBriefingStandardTemplate
    }
  ]
});
