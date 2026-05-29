import { isSupportedStepType } from "../../../../../shared/stepTypes/stepTypeRegistry.js";

export function validatePracticeModeStepType(executionState) {
  var payload = executionState.payload;

  if (!payload.stepType || typeof payload.stepType !== "string") {
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

  if (!isSupportedStepType(payload.stepType)) {
    return {
      valid: false,
      errors: [
        {
          code: "STEP_TYPE_UNSUPPORTED",
          field: "stepType",
          message: "Unsupported step type: " + payload.stepType
        }
      ]
    };
  }

  return { valid: true };
}
