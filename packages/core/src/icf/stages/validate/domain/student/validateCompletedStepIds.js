export function validateCompletedStepIds(executionState) {
  var payload = executionState.payload;
  var stepIndex = 0;

  if (!Array.isArray(payload.completedStepIds)) {
    return {
      valid: false,
      errors: [
        {
          code: "COMPLETED_STEP_IDS_REQUIRED",
          field: "completedStepIds",
          message: "Completed step ids must be an array."
        }
      ]
    };
  }

  while (stepIndex < payload.completedStepIds.length) {
    if (typeof payload.completedStepIds[stepIndex] !== "string" || payload.completedStepIds[stepIndex].length === 0) {
      return {
        valid: false,
        errors: [
          {
            code: "COMPLETED_STEP_ID_INVALID",
            field: "completedStepIds",
            message: "Completed step ids must contain only non-empty strings."
          }
        ]
      };
    }

    stepIndex = stepIndex + 1;
  }

  return { valid: true };
}
