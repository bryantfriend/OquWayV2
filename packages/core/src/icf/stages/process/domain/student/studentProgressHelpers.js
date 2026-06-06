import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.92-student-login-race";
import { createDefaultProgressDocument as createSharedDefaultProgressDocument } from "../../../../../../../domain/progress/index.js";

export function createDefaultProgressDocument(courseId, moduleId, sessionId) {
  return createSharedDefaultProgressDocument(courseId, moduleId, sessionId);
}

export function readPracticeModeProgress(progress, practiceModeKey) {
  if (!progress || !progress.practiceModes || !progress.practiceModes[practiceModeKey]) {
    return {
      completedStepIds: [],
      completionResults: {},
      completed: false,
      updatedAt: null
    };
  }

  return {
    completedStepIds: readCompletedStepIds(progress.practiceModes[practiceModeKey].completedStepIds),
    completionResults: readCompletionResults(progress.practiceModes[practiceModeKey].completionResults),
    completed: progress.practiceModes[practiceModeKey].completed === true,
    updatedAt: progress.practiceModes[practiceModeKey].updatedAt || null
  };
}

export function readCompletedStepIds(value) {
  var result = [];
  var valueIndex = 0;

  if (!Array.isArray(value)) {
    return result;
  }

  while (valueIndex < value.length) {
    appendUniqueStepId(result, value[valueIndex]);
    valueIndex = valueIndex + 1;
  }

  return result;
}

export function appendUniqueStepId(stepIds, stepId) {
  if (typeof stepId !== "string" || stepId.length === 0) {
    return;
  }

  if (stepIds.indexOf(stepId) === -1) {
    stepIds.push(stepId);
  }
}

export function readPracticeModeStepIds(session, practiceModeKey) {
  var stepIds = [];
  var practiceMode = null;
  var steps = [];
  var stepIndex = 0;

  if (!session || !session.practiceModes) {
    return stepIds;
  }

  practiceMode = session.practiceModes[practiceModeKey];

  if (!practiceMode || !Array.isArray(practiceMode.steps)) {
    return stepIds;
  }

  steps = practiceMode.steps.slice();
  steps.sort(function (a, b) {
    return readStepOrder(a) - readStepOrder(b);
  });

  while (stepIndex < steps.length) {
    if (steps[stepIndex] && typeof steps[stepIndex].id === "string") {
      stepIds.push(steps[stepIndex].id);
    }

    stepIndex = stepIndex + 1;
  }

  return stepIds;
}

export async function saveStudentPracticeModeProgress(actor, payload, completedStepIds, completed) {
  var practiceModes = {};
  var existingProgress = readPracticeModeProgressFromPayload(payload);
  var completionResults = Object.assign({}, existingProgress.completionResults);
  var saveData = {};
  var progressRef = doc(db, "studentProgress", actor.id, "courses", payload.courseId, "sessions", payload.sessionId);

  if (payload.stepId && payload.completionResult) {
    completionResults[payload.stepId] = readCompletionResult(payload.completionResult);
  }

  practiceModes[payload.practiceModeKey] = {
    completedStepIds: completedStepIds,
    completionResults: completionResults,
    completed: completed === true,
    updatedAt: serverTimestamp()
  };

  saveData.courseId = payload.courseId;
  saveData.moduleId = payload.moduleId;
  saveData.sessionId = payload.sessionId;
  saveData.practiceModes = practiceModes;
  saveData.updatedAt = serverTimestamp();

  await setDoc(progressRef, saveData, { merge: true });

  return Object.assign(
    createDefaultProgressDocument(payload.courseId, payload.moduleId, payload.sessionId),
    {
      practiceModes: practiceModes
    }
  );
}

function readPracticeModeProgressFromPayload(payload) {
  if (!payload || !payload.existingPracticeModeProgress) {
    return {
      completedStepIds: [],
      completionResults: {},
      completed: false,
      updatedAt: null
    };
  }

  return {
    completedStepIds: readCompletedStepIds(payload.existingPracticeModeProgress.completedStepIds),
    completionResults: readCompletionResults(payload.existingPracticeModeProgress.completionResults),
    completed: payload.existingPracticeModeProgress.completed === true,
    updatedAt: payload.existingPracticeModeProgress.updatedAt || null
  };
}

function readCompletionResults(value) {
  var results = {};
  var keys = [];
  var keyIndex = 0;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return results;
  }

  keys = Object.keys(value);
  while (keyIndex < keys.length) {
    results[keys[keyIndex]] = readCompletionResult(value[keys[keyIndex]]);
    keyIndex = keyIndex + 1;
  }

  return results;
}

function readCompletionResult(value) {
  var result = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  var score = typeof result.score === "number" && Number.isFinite(result.score) ? result.score : 100;
  var data = result.data && typeof result.data === "object" && !Array.isArray(result.data) ? result.data : {};

  return {
    success: result.success === false ? false : true,
    score: score,
    data: data
  };
}

function readStepOrder(step) {
  if (!step || typeof step.order !== "number") {
    return 0;
  }

  return step.order;
}
