import { isSupportedStepType } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.184-scenario-choice";

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
  if (payload && typeof payload.stepType === "string") {
    return payload.stepType;
  }

  if (payload && typeof payload.stepTypeId === "string") {
    return payload.stepTypeId;
  }

  return "";
}
