import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { ReflectionStep } from "../../stepTypes/ReflectionStep.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionSchema } from "./reflection.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionStandardMeta } from "./templates/reflection-standard/reflectionStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as reflectionStandardTemplate from "./templates/reflection-standard/reflectionStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionExitTicketMeta } from "./templates/reflection-exit-ticket/reflectionExitTicket.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as reflectionExitTicketTemplate from "./templates/reflection-exit-ticket/reflectionExitTicket.template.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionLearningJournalMeta } from "./templates/reflection-learning-journal/reflectionLearningJournal.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as reflectionLearningJournalTemplate from "./templates/reflection-learning-journal/reflectionLearningJournal.template.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionEmojiCheckInMeta } from "./templates/reflection-emoji-check-in/reflectionEmojiCheckIn.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as reflectionEmojiCheckInTemplate from "./templates/reflection-emoji-check-in/reflectionEmojiCheckIn.template.js?v=1.1.228-learning-activity-drag-interactions";
import { reflectionGrowthGardenMeta } from "./templates/reflection-growth-garden/reflectionGrowthGarden.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as reflectionGrowthGardenTemplate from "./templates/reflection-growth-garden/reflectionGrowthGarden.template.js?v=1.1.228-learning-activity-drag-interactions";

export const reflectionActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ReflectionStep,
  activityType: "reflection",
  legacyStepType: "reflection",
  displayName: "Reflection",
  description: "A confidence reflection shell.",
  icon: "fa-regular fa-lightbulb",
  category: "Basic",
  complexity: "Easy",
  templateId: "reflection-standard",
  templateDisplayName: "Confidence Scale",
  registryFile: "packages/core/src/shared/learningActivities/reflection/reflection.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/reflection/reflection.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/reflection/reflection.schema.js",
  schema: reflectionSchema,
  templates: [
    {
      meta: reflectionStandardMeta,
      module: reflectionStandardTemplate
    },
    {
      meta: reflectionExitTicketMeta,
      module: reflectionExitTicketTemplate
    },
    {
      meta: reflectionLearningJournalMeta,
      module: reflectionLearningJournalTemplate
    },
    {
      meta: reflectionEmojiCheckInMeta,
      module: reflectionEmojiCheckInTemplate
    },
    {
      meta: reflectionGrowthGardenMeta,
      module: reflectionGrowthGardenTemplate
    }
  ]
});
