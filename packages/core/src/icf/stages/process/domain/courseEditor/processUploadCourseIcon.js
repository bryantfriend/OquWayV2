import { getDownloadURL, ref, storage, uploadBytes } from "../../../../../infrastructure/firebase/storage.js?v=1.1.82-shared-command-center-shell";

export async function processUploadCourseIcon(executionState) {
  var payload = executionState.payload || {};
  var file = payload.file;

  if (!file) {
    return createProcessError("COURSE_ICON_FILE_REQUIRED", "A course icon file is required.");
  }

  try {
    var storagePath = buildStoragePath(executionState, payload, file);
    var storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/webp",
      customMetadata: {
        courseId: payload.courseId,
        uploadedBy: executionState.actor && executionState.actor.id ? executionState.actor.id : ""
      }
    });

    executionState.result = {
      iconUrl: await getDownloadURL(storageRef),
      storagePath: storagePath,
      size: file.size,
      contentType: file.type
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("COURSE_ICON_UPLOAD_FAILED", "Failed to upload course icon: " + error.message);
  }
}

function buildStoragePath(executionState, payload, file) {
  var extension = readUploadExtension(file);
  var createdAt = executionState.meta && executionState.meta.createdAt ? executionState.meta.createdAt : Date.now();

  return "course-icons/" + createSafePathSegment(payload.courseId) + "/course-icon-" + createdAt + "." + extension;
}

function readUploadExtension(file) {
  if (file && file.type === "image/png") {
    return "png";
  }

  if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
    return "jpg";
  }

  if (file && file.type === "image/gif") {
    return "gif";
  }

  return "webp";
}

function createSafePathSegment(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "unknown";
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function createProcessError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}