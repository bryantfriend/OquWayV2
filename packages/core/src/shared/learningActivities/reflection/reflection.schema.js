import { ReflectionStep } from "../../stepTypes/ReflectionStep.js?v=1.1.228-learning-activity-drag-interactions";

export const reflectionSchema = ReflectionStep.editorSchema || { fields: [] };

export function getReflectionDefaultContent() {
  return {
    "question": "How confident do you feel about this skill?",
    "responseType": "scale",
    "minWords": 0
  };
}

export function normalizeReflectionConfig(config) {
  return ReflectionStep.createConfig(Object.assign({}, getReflectionDefaultContent(), config || {}));
}

export function validateReflectionConfig(config) {
  var normalized = normalizeReflectionConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
