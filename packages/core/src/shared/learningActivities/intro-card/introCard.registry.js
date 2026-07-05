import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.226-learning-activity-files";
import { introCardSchema } from "./introCard.schema.js?v=1.1.226-learning-activity-files";
import { introCardStandardMeta } from "./templates/intro-card-standard/introCardStandard.meta.js?v=1.1.226-learning-activity-files";
import * as introCardStandardTemplate from "./templates/intro-card-standard/introCardStandard.template.js?v=1.1.226-learning-activity-files";

export const introCardActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "intro-card",
  legacyStepType: "textBriefing",
  displayName: "Intro Card",
  description: "A focused opening card for a lesson objective, hook, or brief context.",
  icon: "fa-solid fa-id-card",
  category: "Basic",
  complexity: "Easy",
  templateId: "intro-card-standard",
  templateDisplayName: "Intro Card Standard",
  registryFile: "packages/core/src/shared/learningActivities/intro-card/introCard.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/intro-card/introCard.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/intro-card/introCard.schema.js",
  schema: introCardSchema,
  templates: [
    {
      meta: introCardStandardMeta,
      module: introCardStandardTemplate
    }
  ]
});
