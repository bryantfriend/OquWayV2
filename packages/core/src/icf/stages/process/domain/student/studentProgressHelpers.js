import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.162-modal-stack";
import { createDefaultProgressDocument as createSharedDefaultProgressDocument } from "../../../../../../../domain/progress/index.js";
import { resolveActorStudentId } from "../../../../../../../domain/users/index.js?v=1.1.162-modal-stack";

export function createDefaultProgressDocument(courseId, moduleId, sessionId) {
  return createSharedDefaultProgressDocument(courseId, moduleId, sessionId);
}

export function readPracticeModeProgress(progress, practiceModeKey) {
  if (!progress || !progress.practiceModes || !progress.practiceModes[practiceModeKey]) {
    return {
      completedStepIds: [],
      completionResults: {},
      xpEarned: 0,
      starsEarned: 0,
      gamification: {
        xpEarned: 0,
        starsEarned: 0
      },
      completed: false,
      updatedAt: null
    };
  }

  return {
    completedStepIds: readCompletedStepIds(progress.practiceModes[practiceModeKey].completedStepIds),
    completionResults: readCompletionResults(progress.practiceModes[practiceModeKey].completionResults),
    xpEarned: readNonNegativeNumber(progress.practiceModes[practiceModeKey].xpEarned, 0),
    starsEarned: readNonNegativeNumber(progress.practiceModes[practiceModeKey].starsEarned, 0),
    gamification: readGamification(progress.practiceModes[practiceModeKey].gamification),
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
  var xpEarned = calculatePracticeModeXp(completedStepIds, completed);
  var starsEarned = calculatePracticeModeStars(completionResults, completed);
  var saveData = {};
  var progressRef = doc(db, "studentProgress", resolveActorStudentId(actor), "courses", payload.courseId, "sessions", payload.sessionId);

  if (payload.stepId && payload.completionResult) {
    completionResults[payload.stepId] = readCompletionResult(payload.completionResult);
    xpEarned = calculatePracticeModeXp(completedStepIds, completed);
    starsEarned = calculatePracticeModeStars(completionResults, completed);
  }

  practiceModes[payload.practiceModeKey] = {
    completedStepIds: completedStepIds,
    completionResults: completionResults,
    xpEarned: xpEarned,
    starsEarned: starsEarned,
    gamification: {
      xpEarned: xpEarned,
      starsEarned: starsEarned
    },
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
      xpEarned: 0,
      starsEarned: 0,
      gamification: {
        xpEarned: 0,
        starsEarned: 0
      },
      completed: false,
      updatedAt: null
    };
  }

  return {
    completedStepIds: readCompletedStepIds(payload.existingPracticeModeProgress.completedStepIds),
    completionResults: readCompletionResults(payload.existingPracticeModeProgress.completionResults),
    xpEarned: readNonNegativeNumber(payload.existingPracticeModeProgress.xpEarned, 0),
    starsEarned: readNonNegativeNumber(payload.existingPracticeModeProgress.starsEarned, 0),
    gamification: readGamification(payload.existingPracticeModeProgress.gamification),
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

function calculatePracticeModeXp(completedStepIds, completed) {
  var completedCount = Array.isArray(completedStepIds) ? completedStepIds.length : 0;
  return Math.max(0, completedCount * 5 + (completed ? 25 : 0));
}

function calculatePracticeModeStars(completionResults, completed) {
  var scores = [];
  var keys = Object.keys(completionResults || {});
  var keyIndex = 0;
  var averageScore = 0;

  if (!completed) {
    return 0;
  }

  while (keyIndex < keys.length) {
    if (completionResults[keys[keyIndex]] && typeof completionResults[keys[keyIndex]].score === "number") {
      scores.push(Math.max(0, Math.min(100, completionResults[keys[keyIndex]].score)));
    }
    keyIndex = keyIndex + 1;
  }

  if (scores.length === 0) {
    return 0;
  }

  averageScore = scores.reduce(function (total, score) {
    return total + score;
  }, 0) / scores.length;

  if (averageScore >= 90) {
    return 3;
  }

  if (averageScore >= 70) {
    return 2;
  }

  if (averageScore >= 50) {
    return 1;
  }

  return 0;
}

function readGamification(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      xpEarned: 0,
      starsEarned: 0
    };
  }

  return {
    xpEarned: readNonNegativeNumber(value.xpEarned, readNonNegativeNumber(value.xp, 0)),
    starsEarned: readNonNegativeNumber(value.starsEarned, readNonNegativeNumber(value.stars, 0))
  };
}

function readNonNegativeNumber(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  return fallback;
}

function readStepOrder(step) {
  if (!step || typeof step.order !== "number") {
    return 0;
  }

  return step.order;
}
