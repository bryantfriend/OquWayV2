import { CustomExperienceStep } from "../../stepTypes/CustomExperienceStep.js?v=1.1.228-learning-activity-drag-interactions";

export const multiSelectSchema = CustomExperienceStep.editorSchema || { fields: [] };

export function getMultiSelectDefaultContent() {
  return {
    "experienceType": "multi-select",
    "title": "Select All That Apply",
    "theme": "assessment",
    "instructions": "Select every correct option, then complete the activity.",
    "data": "{\"question\":\"Which options apply?\",\"choices\":[\"A\",\"B\",\"C\"]}"
  };
}

export function normalizeMultiSelectConfig(config) {
  return CustomExperienceStep.createConfig(Object.assign({}, getMultiSelectDefaultContent(), config || {}));
}

export function validateMultiSelectConfig(config) {
  var normalized = normalizeMultiSelectConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
