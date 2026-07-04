import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.225-learning-activity-source-folders";
import { VocabularyStep } from "../../stepTypes/VocabularyStep.js?v=1.1.225-learning-activity-source-folders";

export const vocabularyActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: VocabularyStep,
  activityType: "vocabulary",
  legacyStepType: "vocabulary",
  displayName: "Vocabulary",
  description: "Practice a key word with translation and example context.",
  icon: "fa-solid fa-book",
  category: "Basic",
  complexity: "Easy",
  templateId: "vocabulary-standard",
  templateDisplayName: "Vocabulary Standard",
  registryFile: "packages/core/src/shared/learningActivities/vocabulary/vocabulary.registry.js",
  seedConfig: {
      "word": "Algorithm",
      "translation": "A clear sequence of steps",
      "exampleSentence": "We followed an algorithm to solve the problem."
  }
});
