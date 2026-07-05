import { PhraseStep } from "../../stepTypes/PhraseStep.js?v=1.1.226-learning-activity-files";

export const phraseSchema = PhraseStep.editorSchema || { fields: [] };

export function getPhraseDefaultContent() {
  return {
    "phrase": "Can you explain that?",
    "meaning": "Ask someone to say more clearly what they mean.",
    "usageExample": "Can you explain that? I want to understand your idea."
  };
}

export function normalizePhraseConfig(config) {
  return PhraseStep.createConfig(Object.assign({}, getPhraseDefaultContent(), config || {}));
}

export function validatePhraseConfig(config) {
  var normalized = normalizePhraseConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
