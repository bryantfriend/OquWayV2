export function validateOptionalEstimatedMinutes(executionState) {
  const payload = executionState && executionState.payload ? executionState.payload : {};

  if (!Object.prototype.hasOwnProperty.call(payload, "estimatedMinutes")) {
    return { valid: true };
  }

  if (payload.estimatedMinutes === null || payload.estimatedMinutes === "") {
    return { valid: true };
  }

  const value = Number(payload.estimatedMinutes);

  if (Number.isInteger(value) && value > 0) {
    return { valid: true };
  }

  return {
    valid: false,
    errors: [
      {
        field: "estimatedMinutes",
        code: "MODULE_ESTIMATED_MINUTES_INVALID",
        message: "Estimated Time must be a positive whole number of minutes."
      }
    ]
  };
}
