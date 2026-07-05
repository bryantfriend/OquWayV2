import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";

export const multipleChoiceSchema = CustomExperienceStep.editorSchema || { fields: [] };

export function getMultipleChoiceDefaultContent() {
  return {
    "experienceType": "multiple-choice",
    "title": "Check Your Understanding",
    "theme": "assessment",
    "instructions": "Choose the best answer, then complete the activity.",
    "data": "{\"question\":\"What is the best answer?\",\"choices\":[\"A\",\"B\",\"C\"]}"
  };
}

export function normalizeMultipleChoiceConfig(config) {
  return CustomExperienceStep.createConfig(Object.assign({}, getMultipleChoiceDefaultContent(), config || {}));
}

export function validateMultipleChoiceConfig(config) {
  var normalized = normalizeMultipleChoiceConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
