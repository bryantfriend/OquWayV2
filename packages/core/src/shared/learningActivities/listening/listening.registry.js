import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.225-learning-activity-source-folders";

export const listeningActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: ListeningStep,
  activityType: "listening",
  legacyStepType: "listening",
  displayName: "Listening",
  description: "Guide learners through a listening prompt or transcript-based check.",
  icon: "fa-solid fa-headphones",
  category: "Media",
  complexity: "Medium",
  templateId: "listening-standard",
  templateDisplayName: "Listening Standard",
  registryFile: "packages/core/src/shared/learningActivities/listening/listening.registry.js",
  seedConfig: {
      "questionPrompt": "Listen for the main idea.",
      "transcript": "The speaker explains how to check whether a website is safe."
  }
});
