import { VocabularyStep } from "../../stepTypes/VocabularyStep.js?v=1.1.228-learning-activity-drag-interactions";

export const vocabularySchema = VocabularyStep.editorSchema || { fields: [] };

export function getVocabularyDefaultContent() {
  return {
    "word": "Algorithm",
    "translation": "A clear sequence of steps",
    "exampleSentence": "We followed an algorithm to solve the problem."
  };
}

export function normalizeVocabularyConfig(config) {
  return VocabularyStep.createConfig(Object.assign({}, getVocabularyDefaultContent(), config || {}));
}

export function validateVocabularyConfig(config) {
  var normalized = normalizeVocabularyConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
