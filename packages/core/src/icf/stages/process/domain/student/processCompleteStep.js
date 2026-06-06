import {
  appendUniqueStepId,
  readPracticeModeProgress,
  readPracticeModeStepIds,
  saveStudentPracticeModeProgress
} from "./studentProgressHelpers.js?v=1.1.99-student-profile-gate";

export async function processCompleteStep(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;
  var session = executionState.context.session;
  var modeProgress = readPracticeModeProgress(executionState.context.progress, payload.practiceModeKey);
  var completedStepIds = modeProgress.completedStepIds.slice();
  var allStepIds = readPracticeModeStepIds(session, payload.practiceModeKey);
  var completed = false;

  appendUniqueStepId(completedStepIds, payload.stepId);
  completed = allStepIds.length > 0 && countCompletedSteps(allStepIds, completedStepIds) === allStepIds.length;
  payload.existingPracticeModeProgress = modeProgress;

  try {
    await saveStudentPracticeModeProgress(actor, payload, completedStepIds, completed);

    executionState.result = {
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      sessionId: payload.sessionId,
      practiceModeKey: payload.practiceModeKey,
      completedStepIds: completedStepIds,
      completionResults: Object.assign({}, modeProgress.completionResults || {}, createStepCompletionResult(payload.stepId, payload.completionResult)),
      completed: completed
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COMPLETE_STEP_FAILED",
          message: "Failed to complete step: " + error.message
        }
      ]
    };
  }
}

function createStepCompletionResult(stepId, completionResult) {
  var resultMap = {};
  var safeResult = completionResult && typeof completionResult === "object" ? completionResult : {};
  var score = typeof safeResult.score === "number" && Number.isFinite(safeResult.score) ? safeResult.score : 100;
  var data = safeResult.data && typeof safeResult.data === "object" && !Array.isArray(safeResult.data) ? safeResult.data : {};

  if (typeof stepId === "string" && stepId.length > 0) {
    resultMap[stepId] = {
      success: safeResult.success === false ? false : true,
      score: score,
      data: data
    };
  }

  return resultMap;
}

function countCompletedSteps(allStepIds, completedStepIds) {
  var count = 0;
  var stepIndex = 0;

  while (stepIndex < allStepIds.length) {
    if (completedStepIds.indexOf(allStepIds[stepIndex]) !== -1) {
      count = count + 1;
    }

    stepIndex = stepIndex + 1;
  }

  return count;
}
