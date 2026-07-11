export function normalizeExternalTaskPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      courseId: readText(payload.courseId),
      moduleId: readText(payload.moduleId),
      modeId: readText(payload.modeId || payload.practiceModeKey),
      sessionId: readText(payload.sessionId),
      stepId: readText(payload.stepId),
      assignmentId: readText(payload.assignmentId),
      courseAssignmentId: readText(payload.courseAssignmentId || payload.assignmentId),
      submissionId: readText(payload.submissionId),
      previousSubmissionId: readText(payload.previousSubmissionId),
      classId: readText(payload.classId),
      locationId: readText(payload.locationId),
      taskTitle: readText(payload.taskTitle),
      checklistSnapshot: normalizeChecklist(payload.checklistSnapshot || payload.checklist),
      studentNote: readText(payload.studentNote),
      files: Array.isArray(payload.files) ? payload.files : [],
      file: payload.file || null,
      maxFileSizeMb: readNumber(payload.maxFileSizeMb, 10),
      status: "submitted",
      reviewStatus: "pending"
    }
  };
}

export function normalizeExternalTaskReviewPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      submissionId: readText(payload.submissionId),
      reviewStatus: readText(payload.reviewStatus),
      teacherFeedback: readText(payload.teacherFeedback),
      score: clampNumber(payload.score, 0, 100, null)
    }
  };
}

export function normalizeExternalTaskListPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    valid: true,
    data: {
      courseId: readText(payload.courseId),
      moduleId: readText(payload.moduleId),
      stepId: readText(payload.stepId),
      studentId: readText(payload.studentId),
      classId: readText(payload.classId),
      locationId: readText(payload.locationId),
      assignmentId: readText(payload.assignmentId),
      courseAssignmentId: readText(payload.courseAssignmentId || payload.assignmentId),
      teacherOwnershipId: readText(payload.teacherOwnershipId),
      status: readText(payload.status),
      reviewStatus: readText(payload.reviewStatus)
    }
  };
}

function normalizeChecklist(value) {
  if (Array.isArray(value)) {
    return value.map(readText).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(/\r?\n|,/).map(readText).filter(Boolean);
  }

  return [];
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clampNumber(value, min, max, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(numberValue)));
}
function readNumber(value, fallback) {
  var numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}
