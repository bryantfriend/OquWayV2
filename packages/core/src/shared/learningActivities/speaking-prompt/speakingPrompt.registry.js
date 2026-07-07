import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.228-learning-activity-drag-interactions";
import { SpeakingPromptStep } from "../../stepTypes/SpeakingPromptStep.js?v=1.1.228-learning-activity-drag-interactions";
import { speakingPromptSchema } from "./speakingPrompt.schema.js?v=1.1.228-learning-activity-drag-interactions";
import { speakingPromptStandardMeta } from "./templates/speaking-prompt-standard/speakingPromptStandard.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as speakingPromptStandardTemplate from "./templates/speaking-prompt-standard/speakingPromptStandard.template.js?v=1.1.228-learning-activity-drag-interactions";
import { speakingPromptPartnerCoachMeta } from "./templates/speaking-prompt-partner-coach/speakingPromptPartnerCoach.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as speakingPromptPartnerCoachTemplate from "./templates/speaking-prompt-partner-coach/speakingPromptPartnerCoach.template.js?v=1.1.228-learning-activity-drag-interactions";
import { speakingPromptTimedPitchMeta } from "./templates/speaking-prompt-timed-pitch/speakingPromptTimedPitch.meta.js?v=1.1.228-learning-activity-drag-interactions";
import * as speakingPromptTimedPitchTemplate from "./templates/speaking-prompt-timed-pitch/speakingPromptTimedPitch.template.js?v=1.1.228-learning-activity-drag-interactions";

export const speakingPromptActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: SpeakingPromptStep,
  activityType: "speakingPrompt",
  legacyStepType: "speakingPrompt",
  displayName: "Speaking Prompt",
  description: "A speaking prompt shell without recording.",
  icon: "fa-solid fa-microphone",
  category: "Speaking",
  complexity: "Easy",
  templateId: "speakingPrompt-standard",
  templateDisplayName: "Quick Speak",
  registryFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.schema.js",
  schema: speakingPromptSchema,
  templates: [
    {
      meta: speakingPromptStandardMeta,
      module: speakingPromptStandardTemplate
    },
    {
      meta: speakingPromptPartnerCoachMeta,
      module: speakingPromptPartnerCoachTemplate
    },
    {
      meta: speakingPromptTimedPitchMeta,
      module: speakingPromptTimedPitchTemplate
    }
  ]
});
