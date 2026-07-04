import { isSupportedStepType, normalizeStepType } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.222-activity-step-rendering";

export function validatePracticeModeStepType(executionState) {
  var payload = executionState.payload;
  var stepType = readStepType(payload);

  if (!stepType) {
    return {
      valid: false,
      errors: [
        {
          code: "STEP_TYPE_REQUIRED",
          field: "stepType",
          message: "Step type is required."
        }
      ]
    };
  }

  if (!isSupportedStepType(stepType)) {
    return {
      valid: false,
      errors: [
        {
          code: "STEP_TYPE_UNSUPPORTED",
          field: "stepType",
          message: "Unsupported step type: " + stepType
        }
      ]
    };
  }

  return { valid: true };
}

function readStepType(payload) {
  var config = payload && payload.config && typeof payload.config === "object" && !Array.isArray(payload.config) ? payload.config : {};
  var stepType = payload && (payload.stepType || payload.stepTypeId || payload.type || payload.activityType || config.type || config.stepType || config.activityType);

  return normalizeStepType(stepType || "");
}
