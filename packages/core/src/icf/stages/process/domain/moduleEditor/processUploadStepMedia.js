import { db, doc, getDoc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js";
import { getDownloadURL, ref, storage, uploadBytes } from "../../../../../infrastructure/firebase/storage.js";
import { createDefaultStepConfig } from "../../../../../shared/stepTypes/stepTypeRegistry.js";
import { normalizePracticeModes, updatePracticeModeStep } from "./practiceModeShells.js";

export async function processUploadStepMedia(executionState) {
  var payload = executionState.payload;
  var session = findSessionForMode(executionState);
  var practiceModes = normalizePracticeModes(session ? session.practiceModes : {});
  var step = await readCanonicalStep(executionState, payload);

  if (!step) {
    step = findStep(practiceModes, payload.practiceModeKey, payload.stepId);
  }

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
    var updatedPracticeModes = upsertStepInPracticeMode(practiceModes, payload.practiceModeKey, step, {
      config: config
    });

    await savePracticeModes(executionState, payload, session, updatedPracticeModes, step, config);

    executionState.result = {
      session: Object.assign({}, session || createSessionShellForMode(executionState), { practiceModes: updatedPracticeModes }),
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

async function readCanonicalStep(executionState, payload) {
  if (!payload.courseId || !payload.moduleId || !payload.modeId || !payload.stepId) {
    return null;
  }

  var stepRef = doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId, "steps", payload.stepId);
  var stepSnap = await getDoc(stepRef);

  if (!stepSnap.exists()) {
    return null;
  }

  return Object.assign({ id: stepSnap.id }, stepSnap.data() || {});
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

function upsertStepInPracticeMode(practiceModes, practiceModeKey, step, stepPatch) {
  var updatedPracticeModes = updatePracticeModeStep(practiceModes, practiceModeKey, step.id, stepPatch);
  var updatedStep = findStep(updatedPracticeModes, practiceModeKey, step.id);

  if (updatedStep) {
    return updatedPracticeModes;
  }

  var practiceMode = updatedPracticeModes[practiceModeKey];
  var steps = practiceMode && Array.isArray(practiceMode.steps) ? practiceMode.steps.slice() : [];
  steps.push(Object.assign({}, step, stepPatch, {
    id: step.id,
    updatedAt: Date.now(),
    order: steps.length + 1
  }));
  practiceMode.steps = steps;
  updatedPracticeModes[practiceModeKey] = practiceMode;
  return updatedPracticeModes;
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
  var safeFileName = createSafeFileName(payload.file.name);

  return "step-media/" + createSafePathSegment(payload.courseId)
    + "/" + createSafePathSegment(payload.moduleId)
    + "/" + createSafePathSegment(payload.modeId)
    + "/" + createSafePathSegment(step.id)
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

async function savePracticeModes(executionState, payload, session, practiceModes, step, config) {
  if (session && payload.sessionId) {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "sessions", payload.sessionId), {
      practiceModes: practiceModes,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  if (payload.modeId && step) {
    await setDoc(doc(db, readCourseCollectionName(executionState), payload.courseId, "modules", payload.moduleId, "learningModes", payload.modeId, "steps", payload.stepId), {
      id: payload.stepId,
      type: step.type,
      stepTypeId: step.stepTypeId || step.type,
      title: step.title,
      instructions: step.instructions,
      config: config,
      status: step.status,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}

function findSessionForMode(executionState) {
  var payload = executionState.payload || {};
  var sessions = Array.isArray(executionState.context.sessions) ? executionState.context.sessions : [];
  var learningMode = executionState.context.learningMode || {};
  var index = 0;

  while (index < sessions.length) {
    if ((payload.sessionId && sessions[index].id === payload.sessionId) ||
      (learningMode.legacySessionId && sessions[index].id === learningMode.legacySessionId) ||
      (payload.modeId && sessions[index].learningModeId === payload.modeId)) {
      return sessions[index];
    }

    index = index + 1;
  }

  return null;
}

function createSessionShellForMode(executionState) {
  var payload = executionState.payload || {};
  var learningMode = executionState.context.learningMode || {};

  return {
    id: payload.sessionId || learningMode.legacySessionId || "mode-" + (payload.modeId || "primary") + "-canonical",
    title: { en: readText(learningMode.title, "Learning Mode"), ru: "", ky: "" },
    description: learningMode.purpose || "",
    learningModeId: payload.modeId || learningMode.id || "primary",
    learningModeType: learningMode.modeType || "custom",
    status: learningMode.status || "draft",
    isLearningModeShell: true
  };
}

function readText(value, fallbackText) {
  if (typeof value === "string") {
    return value.trim() || fallbackText;
  }

  if (value && typeof value === "object") {
    return value.en || value.ru || value.ky || fallbackText;
  }

  return fallbackText;
}

function readCourseCollectionName(executionState) {
  return executionState.context && executionState.context.courseCollectionName
    ? executionState.context.courseCollectionName
    : "catalogCourses";
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
