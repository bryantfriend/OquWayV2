import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { getDownloadURL, ref, storage, uploadBytes } from "../../../../../infrastructure/firebase/storage.js";
import { createDefaultStepConfig } from "../../../../../shared/stepTypes/stepTypeRegistry.js";
import { normalizePracticeModes, updatePracticeModeStep } from "./practiceModeShells.js";

export async function processUploadStepMedia(executionState) {
  var payload = executionState.payload;
  var session = executionState.context.session;
  var practiceModes = normalizePracticeModes(session.practiceModes);
  var step = findStep(practiceModes, payload.practiceModeKey, payload.stepId);

  if (!step) {
    return createProcessError("STEP_NOT_FOUND", "Selected step was not found.");
  }

  if (!stepSupportsMediaField(step, payload.mediaField)) {
    return createProcessError("STEP_MEDIA_FIELD_NOT_ALLOWED", "This step type does not support " + payload.mediaField + ".");
  }

  try {
    var storagePath = buildStoragePath(payload, step);
    var storageRef = ref(storage, storagePath);
    var metadata = {
      contentType: payload.file.type
    };

    await uploadBytes(storageRef, payload.file, metadata);

    var downloadUrl = await getDownloadURL(storageRef);
    var config = createUpdatedConfig(step, payload.mediaField, downloadUrl, storagePath);
    var updatedPracticeModes = updatePracticeModeStep(practiceModes, payload.practiceModeKey, payload.stepId, {
      config: config
    });

    await savePracticeModes(payload, updatedPracticeModes);

    executionState.result = {
      session: Object.assign({}, session, { practiceModes: updatedPracticeModes }),
      media: {
        mediaField: payload.mediaField,
        downloadUrl: downloadUrl,
        storagePath: storagePath,
        stepId: payload.stepId
      }
    };

    return { valid: true };
  } catch (error) {
    return createProcessError("STEP_MEDIA_UPLOAD_FAILED", "Failed to upload step media: " + error.message);
  }
}

function findStep(practiceModes, practiceModeKey, stepId) {
  var practiceMode = practiceModes[practiceModeKey];
  var steps = [];
  var stepIndex = 0;

  if (!practiceMode || !Array.isArray(practiceMode.steps)) {
    return null;
  }

  steps = practiceMode.steps;

  while (stepIndex < steps.length) {
    if (steps[stepIndex].id === stepId) {
      return steps[stepIndex];
    }

    stepIndex = stepIndex + 1;
  }

  return null;
}

function stepSupportsMediaField(step, mediaField) {
  if (mediaField === "imageUrl") {
    return step.type === "vocabulary" || step.type === "textBriefing";
  }

  if (mediaField === "audioUrl") {
    return step.type === "vocabulary" || step.type === "phrase" || step.type === "listening";
  }

  return false;
}

function createUpdatedConfig(step, mediaField, downloadUrl, storagePath) {
  var config = createDefaultStepConfig(step.type, step.config);
  var storagePathKey = getStoragePathKey(mediaField);

  config[mediaField] = downloadUrl;
  config[storagePathKey] = storagePath;

  return config;
}

function getStoragePathKey(mediaField) {
  if (mediaField === "imageUrl") {
    return "imageStoragePath";
  }

  return "audioStoragePath";
}

function buildStoragePath(payload, step) {
  var mediaFolder = payload.mediaField === "imageUrl" ? "images" : "audio";
  var safeFileName = createSafeFileName(payload.file.name);

  return "media/courses/" + createSafePathSegment(payload.courseId)
    + "/modules/" + createSafePathSegment(payload.moduleId)
    + "/sessions/" + createSafePathSegment(payload.sessionId)
    + "/practiceModes/" + createSafePathSegment(payload.practiceModeKey)
    + "/steps/" + createSafePathSegment(step.id)
    + "/" + mediaFolder
    + "/" + Date.now()
    + "-" + safeFileName;
}

function createSafePathSegment(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "unknown";
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function createSafeFileName(fileName) {
  if (typeof fileName !== "string" || fileName.length === 0) {
    return "upload";
  }

  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function savePracticeModes(payload, practiceModes) {
  await setDoc(doc(db, "courses", payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
    practiceModes: practiceModes,
    updatedAt: serverTimestamp()
  }, { merge: true });
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
