export function validatePracticeModeStepOrder(executionState) {
  var payload = executionState.payload || {};
  var orderedStepIds = payload.orderedStepIds;
  var seenStepIds = {};
  var index = 0;

  if (!Array.isArray(orderedStepIds)) {
    return {
      valid: false,
      errors: [
        {
          code: "INVALID_ORDERED_STEP_IDS",
          message: "orderedStepIds must be an array."
        }
      ]
    };
  }

  if (orderedStepIds.length === 0) {
    return {
      valid: false,
      errors: [
        {
          code: "EMPTY_ORDERED_STEP_IDS",
          message: "orderedStepIds must include at least one step."
        }
      ]
    };
  }

  while (index < orderedStepIds.length) {
    if (typeof orderedStepIds[index] !== "string" || orderedStepIds[index].trim().length === 0) {
      return {
        valid: false,
        errors: [
          {
            code: "INVALID_ORDERED_STEP_ID",
            message: "orderedStepIds can only contain non-empty step IDs."
          }
        ]
      };
    }

    if (seenStepIds[orderedStepIds[index]]) {
      return {
        valid: false,
        errors: [
          {
            code: "DUPLICATE_ORDERED_STEP_ID",
            message: "orderedStepIds cannot contain duplicate step IDs."
          }
        ]
      };
    }

    seenStepIds[orderedStepIds[index]] = true;
    orderedStepIds[index] = orderedStepIds[index].trim();
    index = index + 1;
  }

  return { valid: true };
}
