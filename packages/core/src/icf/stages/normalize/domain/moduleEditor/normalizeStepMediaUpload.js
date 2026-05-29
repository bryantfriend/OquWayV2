export function normalizeStepMediaUpload(executionState) {
  var payload = executionState.payload;

  return {
    valid: true,
    data: {
      mediaField: readText(payload.mediaField),
      file: payload.file
    }
  };
}

function readText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
