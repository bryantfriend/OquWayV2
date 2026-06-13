import { readSafeString } from "../../shared/utils/index.js";

export function normalizeStep(step) {
  var safeStep = step || {};

  return Object.assign({}, safeStep, {
    id: readSafeString(safeStep.id || safeStep.stepId),
    title: readStepTitle(safeStep),
    type: readSafeString(safeStep.type || safeStep.stepType)
  });
}

export function readStepTitle(step) {
  var title = step && step.title;

  if (typeof title === "string") {
    return title.trim() || "Untitled Step";
  }

  if (title && typeof title.en === "string") {
    return title.en.trim() || "Untitled Step";
  }

  return readSafeString(step && (step.name || step.displayName || step.taskTitle)).trim() || "Untitled Step";
}

export * from "./stepTypeRegistry.js?v=1.1.183-multi-select-step";
