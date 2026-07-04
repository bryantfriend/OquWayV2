import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { PhraseStep } from "../../stepTypes/PhraseStep.js?v=1.1.225-learning-activity-source-folders";

export const phraseActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: PhraseStep,
  activityType: "phrase",
  legacyStepType: "phrase",
  displayName: "Phrase",
  description: "Practice a useful phrase with meaning and usage support.",
  icon: "fa-solid fa-comments",
  category: "Basic",
  complexity: "Easy",
  templateId: "phrase-standard",
  templateDisplayName: "Phrase Standard",
  registryFile: "packages/core/src/shared/learningActivities/phrase/phrase.registry.js",
  seedConfig: {
      "phrase": "Can you explain that?",
      "meaning": "Ask someone to say more clearly what they mean.",
      "usageExample": "Can you explain that? I want to understand your idea."
  }
});
