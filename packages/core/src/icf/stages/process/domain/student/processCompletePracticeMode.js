import {
  readPracticeModeProgress,
  readPracticeModeStepIds,
  saveStudentPracticeModeProgress
} from "./studentProgressHelpers.js?v=1.1.82-shared-command-center-shell";
import { resolveStudentId } from "../../../../../../../domain/users/index.js";

export async function processCompletePracticeMode(executionState) {
  var payload = executionState.payload;
  var actor = executionState.actor;
  var resolvedActor = Object.assign({}, actor || {}, {
    id: resolveStudentId(executionState.context ? executionState.context.studentProfile : null, actor) || (actor && actor.id ? actor.id : "")
  });
  var session = executionState.context.session;
  var modeProgress = readPracticeModeProgress(executionState.context.progress, payload.practiceModeKey);
  var completedStepIds = mergeStepIds(modeProgress.completedStepIds, readPracticeModeStepIds(session, payload.practiceModeKey));
  payload.existingPracticeModeProgress = modeProgress;

  try {
    var savedProgress = await saveStudentPracticeModeProgress(resolvedActor, payload, completedStepIds, true);
    var savedModeProgress = readPracticeModeProgress(savedProgress, payload.practiceModeKey);

    executionState.result = {
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      sessionId: payload.sessionId,
      practiceModeKey: payload.practiceModeKey,
      completedStepIds: savedModeProgress.completedStepIds,
      completionResults: savedModeProgress.completionResults,
      xpEarned: savedModeProgress.xpEarned,
      starsEarned: savedModeProgress.starsEarned,
      gamification: savedModeProgress.gamification,
      completed: savedModeProgress.completed
    };

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "COMPLETE_PRACTICE_MODE_FAILED",
          message: "Failed to complete practice mode: " + error.message
        }
      ]
    };
  }
}

function mergeStepIds(existingStepIds, nextStepIds) {
  var mergedStepIds = [];
  var stepIndex = 0;

  while (stepIndex < existingStepIds.length) {
    appendUnique(mergedStepIds, existingStepIds[stepIndex]);
    stepIndex = stepIndex + 1;
  }

  stepIndex = 0;
  while (stepIndex < nextStepIds.length) {
    appendUnique(mergedStepIds, nextStepIds[stepIndex]);
    stepIndex = stepIndex + 1;
  }

  return mergedStepIds;
}

function appendUnique(stepIds, stepId) {
  if (typeof stepId === "string" && stepId.length > 0 && stepIds.indexOf(stepId) === -1) {
    stepIds.push(stepId);
  }
}
