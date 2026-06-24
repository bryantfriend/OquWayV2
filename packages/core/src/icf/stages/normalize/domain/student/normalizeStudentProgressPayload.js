export function normalizeStudentProgressPayload(executionState) {
  var payload = executionState.payload;
  var normalizedCompletedStepIds = [];
  var stepIndex = 0;

  if (Array.isArray(payload.completedStepIds)) {
    while (stepIndex < payload.completedStepIds.length) {
      appendUniqueStepId(normalizedCompletedStepIds, payload.completedStepIds[stepIndex]);
      stepIndex = stepIndex + 1;
    }
  }

  return {
    courseId: readTrimmedText(payload.courseId),
    moduleCourseId: readTrimmedText(payload.moduleCourseId),
    progressCourseId: readTrimmedText(payload.progressCourseId || payload.courseId),
    courseRecordSource: readTrimmedText(payload.courseRecordSource),
    moduleSource: readTrimmedText(payload.moduleSource),
    source: readTrimmedText(payload.source),
    moduleId: readTrimmedText(payload.moduleId),
    sessionId: readTrimmedText(payload.sessionId),
    practiceModeKey: readTrimmedText(payload.practiceModeKey),
    stepId: readTrimmedText(payload.stepId),
    completedStepIds: normalizedCompletedStepIds,
    completionResult: normalizeCompletionResult(payload.completionResult),
    completed: payload.completed === true
  };
}

function appendUniqueStepId(stepIds, value) {
  var stepId = readTrimmedText(value);

  if (stepId.length === 0) {
    return;
  }

  if (stepIds.indexOf(stepId) === -1) {
    stepIds.push(stepId);
  }
}

function readTrimmedText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeCompletionResult(value) {
  var result = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  var score = typeof result.score === "number" && Number.isFinite(result.score) ? result.score : 100;
  var data = result.data && typeof result.data === "object" && !Array.isArray(result.data) ? result.data : {};

  return {
    success: result.success === false ? false : true,
    score: score,
    data: data
  };
}
