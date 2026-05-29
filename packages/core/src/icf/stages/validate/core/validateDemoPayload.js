export function validateDemoPayload(executionState) {
  if (!executionState.payload || !executionState.payload.message) {
    return {
      ok: false,
      errors: [{ code: "MISSING_MESSAGE", message: "payload.message is required." }]
    };
  }

  if (typeof executionState.payload.message !== "string") {
    return {
      ok: false,
      errors: [{ code: "INVALID_MESSAGE", message: "payload.message must be a string." }]
    };
  }

  return {
    ok: true,
    data: {
      validateMarker: "Validate"
    }
  };
}
