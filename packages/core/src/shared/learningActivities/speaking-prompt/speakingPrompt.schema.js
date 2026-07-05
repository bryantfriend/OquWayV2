import { SpeakingPromptStep } from "../../stepTypes/SpeakingPromptStep.js?v=1.1.226-learning-activity-files";

export const speakingPromptSchema = SpeakingPromptStep.editorSchema || { fields: [] };

export function getSpeakingPromptDefaultContent() {
  return {
    "prompt": "Explain one way to stay safe online.",
    "preparationSeconds": 20,
    "speakingSeconds": 45
  };
}

export function normalizeSpeakingPromptConfig(config) {
  return SpeakingPromptStep.createConfig(Object.assign({}, getSpeakingPromptDefaultContent(), config || {}));
}

export function validateSpeakingPromptConfig(config) {
  var normalized = normalizeSpeakingPromptConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
