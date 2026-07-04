import { readSafeString } from "../../shared/utils/index.js";
import { normalizeStepType } from "./stepTypeRegistry.js";

export function normalizeStep(step) {
  var safeStep = step || {};

  return Object.assign({}, safeStep, {
    id: readSafeString(safeStep.id || safeStep.stepId),
    title: readStepTitle(safeStep),
    type: readStepType(safeStep)
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

export function readStepType(step) {
  var safeStep = step || {};
  var config = safeStep.config && typeof safeStep.config === "object" && !Array.isArray(safeStep.config) ? safeStep.config : {};

  return normalizeStepType(readSafeString(safeStep.type || safeStep.stepType || safeStep.stepTypeId || safeStep.activityType || config.type || config.stepType || config.activityType));
}

export * from "./stepTypeRegistry.js";
