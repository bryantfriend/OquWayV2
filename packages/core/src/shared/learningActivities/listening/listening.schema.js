import { ListeningStep } from "../../stepTypes/ListeningStep.js?v=1.1.228-learning-activity-drag-interactions";

export const listeningSchema = ListeningStep.editorSchema || { fields: [] };

export function getListeningDefaultContent() {
  return {
    "questionPrompt": "Listen for the main idea.",
    "transcript": "The speaker explains how to check whether a website is safe."
  };
}

export function normalizeListeningConfig(config) {
  return ListeningStep.createConfig(Object.assign({}, getListeningDefaultContent(), config || {}));
}

export function validateListeningConfig(config) {
  var normalized = normalizeListeningConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
