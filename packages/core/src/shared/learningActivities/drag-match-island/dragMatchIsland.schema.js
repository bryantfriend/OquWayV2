import { DragMatchIslandStep } from "../../stepTypes/DragMatchIslandStep.js?v=1.1.226-learning-activity-files";

export const dragMatchIslandSchema = DragMatchIslandStep.editorSchema || { fields: [] };

export function getDragMatchIslandDefaultContent() {
  return {
    "title": "Input Device Island",
    "subtitle": "Match each item to the right place.",
    "items": "Keyboard\nMouse\nMonitor\nPrinter",
    "theme": "sunny"
  };
}

export function normalizeDragMatchIslandConfig(config) {
  return DragMatchIslandStep.createConfig(Object.assign({}, getDragMatchIslandDefaultContent(), config || {}));
}

export function validateDragMatchIslandConfig(config) {
  var normalized = normalizeDragMatchIslandConfig(config);
  return {
    valid: Boolean(normalized),
    errors: [],
    data: normalized
  };
}
