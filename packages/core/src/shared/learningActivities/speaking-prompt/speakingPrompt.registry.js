import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { SpeakingPromptStep } from "../../stepTypes/SpeakingPromptStep.js?v=1.1.225-learning-activity-source-folders";

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
  seedConfig: {
      "prompt": "Explain one way to stay safe online.",
      "preparationSeconds": 20,
      "speakingSeconds": 45
  }
});
