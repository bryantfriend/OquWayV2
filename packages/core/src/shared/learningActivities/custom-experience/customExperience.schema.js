import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.226-learning-activity-files";

export const customExperienceSchema = CustomExperienceStep.editorSchema || { fields: [] };

export function getCustomExperienceDefaultContent() {
  return {
    "experienceType": "interactive-shell",
    "title": "Custom Learning Experience",
    "theme": "studio",
    "instructions": "Use this shell to prototype a specialized activity.",
    "data": "{\"mode\":\"preview\"}"
  };
}

export function normalizeCustomExperienceConfig(config) {
  return CustomExperienceStep.createConfig(Object.assign({}, getCustomExperienceDefaultContent(), config || {}));
}

export function validateCustomExperienceConfig(config) {
  var normalized = normalizeCustomExperienceConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
