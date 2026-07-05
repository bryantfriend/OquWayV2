import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.226-learning-activity-files";
import { SpeakingPromptStep } from "../../stepTypes/SpeakingPromptStep.js?v=1.1.226-learning-activity-files";
import { speakingPromptSchema } from "./speakingPrompt.schema.js?v=1.1.226-learning-activity-files";
import { speakingPromptStandardMeta } from "./templates/speaking-prompt-standard/speakingPromptStandard.meta.js?v=1.1.226-learning-activity-files";
import * as speakingPromptStandardTemplate from "./templates/speaking-prompt-standard/speakingPromptStandard.template.js?v=1.1.226-learning-activity-files";

export const speakingPromptActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: SpeakingPromptStep,
  activityType: "speakingPrompt",
  legacyStepType: "speakingPrompt",
  displayName: "Speaking Prompt",
  description: "Prompt learners to prepare and speak a short response.",
  icon: "fa-solid fa-microphone",
  category: "Speaking",
  complexity: "Medium",
  templateId: "speakingPrompt-standard",
  templateDisplayName: "Speaking Prompt Standard",
  registryFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/speaking-prompt/speakingPrompt.schema.js",
  schema: speakingPromptSchema,
  templates: [
    {
      meta: speakingPromptStandardMeta,
      module: speakingPromptStandardTemplate
    }
  ]
});
