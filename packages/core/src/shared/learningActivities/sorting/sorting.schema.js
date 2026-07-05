import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.226-learning-activity-files";

export const sortingSchema = DragMatchIslandStep.editorSchema || { fields: [] };

export function getSortingDefaultContent() {
  return {
    "title": "Sort the Ideas",
    "subtitle": "Move each item to the best matching place.",
    "items": "Example 1\nExample 2\nExample 3\nExample 4",
    "theme": "sunny"
  };
}

export function normalizeSortingConfig(config) {
  return DragMatchIslandStep.createConfig(Object.assign({}, getSortingDefaultContent(), config || {}));
}

export function validateSortingConfig(config) {
  var normalized = normalizeSortingConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
