export function validateStepMediaFile(executionState) {
  var payload = executionState.payload;
  var file = payload.file;
  var maxFileSize = 10 * 1024 * 1024;

  if (!file || typeof file !== "object") {
    return createInvalidFileResult("MEDIA_FILE_REQUIRED", "A media file is required.");
  }

  if (typeof file.name !== "string" || file.name.length === 0) {
    return createInvalidFileResult("MEDIA_FILE_NAME_REQUIRED", "The uploaded file must have a name.");
  }

  if (typeof file.type !== "string" || file.type.length === 0) {
    return createInvalidFileResult("MEDIA_FILE_TYPE_REQUIRED", "The uploaded file must have a file type.");
  }

  if (typeof file.size === "number" && file.size > maxFileSize) {
    return createInvalidFileResult("MEDIA_FILE_TOO_LARGE", "Media uploads must be 10MB or smaller.");
  }

  if (payload.mediaField === "imageUrl" && file.type.indexOf("image/") !== 0) {
    return createInvalidFileResult("MEDIA_FILE_TYPE_UNSUPPORTED", "Image fields only accept image files.");
  }

  if (payload.mediaField === "audioUrl" && file.type.indexOf("audio/") !== 0) {
    return createInvalidFileResult("MEDIA_FILE_TYPE_UNSUPPORTED", "Audio fields only accept audio files.");
  }

  return { valid: true };
}

function createInvalidFileResult(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        field: "file",
        message: message
      }
    ]
  };
}
