import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.116-student-token-ready";
import { getDownloadURL, ref, storage, uploadBytes } from "../../../../../infrastructure/firebase/storage.js?v=1.1.116-student-token-ready";
import { createDefaultStepConfig } from "../../../../../../../domain/steps/index.js";

export async function processUploadStepMedia(executionState) {
  var payload = executionState.payload || {};
  var learningMode = executionState.context.learningMode || {};
  var step = findStepById(learningMode.steps, payload.stepId);

  if (!step) {
    return createProcessError("STEP_NOT_FOUND", "Selected step was not found.");
  }

  if (!stepSupportsMediaField(step, payload.mediaField)) {
    return createProcessError("STEP_MEDIA_FIELD_NOT_ALLOWED", "This step type does not support " + payload.mediaField + ".");
  }

  try {
    var storagePath = buildStoragePath(payload);
    var storageRef = ref(storage, storagePath);
    var metadata = {
      contentType: payload.file.type
    };

    await uploadBytes(storageRef, payload.file, metadata);

    var downloadUrl = await getDownloadURL(storageRef);
    var config = createUpdatedConfig(step, payload.mediaField, downloadUrl, storagePath);
    var updatedStep = Object.assign({}, step, {
      config: config,
      updatedAt: Date.now()
    });
    var updatedLearningMode = createUpdatedLearningMode(learningMode, updatedStep);

    await setDoc(doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId, "steps", payload.stepId), {
      id: payload.stepId,
      type: updatedStep.type,
      stepTypeId: updatedStep.stepTypeId || updatedStep.type,
      title: updatedStep.title,
      instructions: updatedStep.instructions,
      config: config,
      status: updatedStep.status,
      updatedAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId), {
      stepCount: updatedLearningMode.stepCount,
      stepOrder: updatedLearningMode.stepOrder,
      updatedAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "catalogCourses", payload.courseId, "modules", payload.moduleId), {
      learningModes: {
        [payload.modeId]: updatedLearningMode
      },
      updatedAt: serverTimestamp()
    }, { merge: true });

    executionState.result = {
      learningMode: updatedLearningMode,
      step: updatedStep,
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

function findStepById(steps, stepId) {
  var safeSteps = Array.isArray(steps) ? steps : [];
  var index = 0;

  while (index < safeSteps.length) {
    if (safeSteps[index] && safeSteps[index].id === stepId) {
      return safeSteps[index];
    }

    index = index + 1;
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

function buildStoragePath(payload) {
  return "step-media/" + createSafePathSegment(payload.courseId)
    + "/" + createSafePathSegment(payload.moduleId)
    + "/" + createSafePathSegment(payload.modeId)
    + "/" + createSafePathSegment(payload.stepId)
    + "/" + createSafeFileName(payload.file.name);
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

function createUpdatedLearningMode(learningMode, updatedStep) {
  var steps = Array.isArray(learningMode.steps) ? learningMode.steps.slice() : [];
  var stepFound = false;

  steps = steps.map(function (step) {
    if (step && step.id === updatedStep.id) {
      stepFound = true;
      return updatedStep;
    }

    return step;
  });

  if (!stepFound) {
    steps.push(updatedStep);
  }

  steps.sort(function (firstStep, secondStep) {
    return readOrder(firstStep) - readOrder(secondStep);
  });

  return Object.assign({}, learningMode, {
    steps: steps,
    stepCount: steps.length,
    stepOrder: steps.map(function (step) {
      return step.id;
    }).filter(Boolean),
    updatedAt: Date.now()
  });
}

function readOrder(step) {
  if (step && typeof step.order === "number" && Number.isFinite(step.order)) {
    return step.order;
  }

  return 0;
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
