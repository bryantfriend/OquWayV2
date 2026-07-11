import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { TextBriefingStep } from "../../stepTypes/TextBriefingStep.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardSchema } from "./introCard.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardStandardMeta } from "./templates/intro-card-standard/introCardStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as introCardStandardTemplate from "./templates/intro-card-standard/introCardStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardMissionBriefMeta } from "./templates/intro-card-mission-brief/introCardMissionBrief.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as introCardMissionBriefTemplate from "./templates/intro-card-mission-brief/introCardMissionBrief.template.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardStoryHookMeta } from "./templates/intro-card-story-hook/introCardStoryHook.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as introCardStoryHookTemplate from "./templates/intro-card-story-hook/introCardStoryHook.template.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardMysteryDoorMeta } from "./templates/intro-card-mystery-door/introCardMysteryDoor.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as introCardMysteryDoorTemplate from "./templates/intro-card-mystery-door/introCardMysteryDoor.template.js?v=1.1.228-learning-activity-drag-interactions";
import { introCardSkillTrailerMeta } from "./templates/intro-card-skill-trailer/introCardSkillTrailer.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as introCardSkillTrailerTemplate from "./templates/intro-card-skill-trailer/introCardSkillTrailer.template.js?v=1.1.228-learning-activity-drag-interactions";

export const introCardActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: TextBriefingStep,
  activityType: "intro-card",
  legacyStepType: "textBriefing",
  displayName: "Intro Card",
  description: "A compact opening card for a lesson or module.",
  icon: "fa-regular fa-id-card",
  category: "Basic",
  complexity: "Easy",
  templateId: "intro-card-standard",
  templateDisplayName: "Welcome Card",
  registryFile: "packages/core/src/shared/learningActivities/intro-card/introCard.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/intro-card/introCard.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/intro-card/introCard.schema.js",
  schema: introCardSchema,
  templates: [
    {
      meta: introCardStandardMeta,
      module: introCardStandardTemplate
    },
    {
      meta: introCardMissionBriefMeta,
      module: introCardMissionBriefTemplate
    },
    {
      meta: introCardStoryHookMeta,
      module: introCardStoryHookTemplate
    },
    {
      meta: introCardMysteryDoorMeta,
      module: introCardMysteryDoorTemplate
    },
    {
      meta: introCardSkillTrailerMeta,
      module: introCardSkillTrailerTemplate
    }
  ]
});
