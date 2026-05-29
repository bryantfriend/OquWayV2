export function validateStepMediaField(executionState) {
  var payload = executionState.payload;

  if (!payload.mediaField || typeof payload.mediaField !== "string") {
    return {
      valid: false,
      errors: [
        {
          code: "MEDIA_FIELD_REQUIRED",
          field: "mediaField",
          message: "Media field is required."
        }
      ]
    };
  }

  if (payload.mediaField !== "imageUrl" && payload.mediaField !== "audioUrl") {
    return {
      valid: false,
      errors: [
        {
          code: "MEDIA_FIELD_UNSUPPORTED",
          field: "mediaField",
          message: "Unsupported media field: " + payload.mediaField
        }
      ]
    };
  }

  return { valid: true };
}
