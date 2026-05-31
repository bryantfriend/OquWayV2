export function validateExternalTaskStepPayload(executionState) {
  return validateRequiredTextFields(executionState.payload, ["courseId", "moduleId", "stepId"]);
}

export function validateExternalTaskSubmitPayload(executionState) {
  var result = validateRequiredTextFields(executionState.payload, ["courseId", "moduleId", "stepId", "taskTitle"]);

  if (!result.valid) {
    return result;
  }

  if (executionState.payload.files && !Array.isArray(executionState.payload.files)) {
    return createError("EXTERNAL_TASK_FILES_INVALID", "External task files must be an array.");
  }

  return { valid: true };
}

export function validateExternalTaskUploadPayload(executionState) {
  var result = validateRequiredTextFields(executionState.payload, ["courseId", "moduleId", "stepId", "submissionId"]);

  if (!result.valid) {
    return result;
  }

  if (!executionState.payload.file) {
    return createError("EXTERNAL_TASK_FILE_REQUIRED", "Choose a file to upload.");
  }

  return { valid: true };
}

export function validateExternalTaskSubmissionsQuery(executionState) {
  var payload = executionState.payload || {};

  if (!payload.courseId && !payload.classId && !payload.studentId && !payload.status && !payload.reviewStatus) {
    return { valid: true };
  }

  return { valid: true };
}

export function validateExternalTaskReviewPayload(executionState) {
  var payload = executionState.payload || {};
  var allowed = ["complete", "needsWork", "incomplete"];

  if (!payload.submissionId) {
    return createError("EXTERNAL_TASK_SUBMISSION_REQUIRED", "Submission ID is required.");
  }

  if (allowed.indexOf(payload.reviewStatus) === -1) {
    return createError("EXTERNAL_TASK_REVIEW_STATUS_INVALID", "Review status must be complete, needsWork, or incomplete.");
  }

  return { valid: true };
}

function validateRequiredTextFields(payload, fields) {
  var safePayload = payload || {};
  var index = 0;

  while (index < fields.length) {
    if (!safePayload[fields[index]] || typeof safePayload[fields[index]] !== "string") {
      return createError("EXTERNAL_TASK_FIELD_REQUIRED", fields[index] + " is required.");
    }
    index = index + 1;
  }

  return { valid: true };
}

function createError(code, message) {
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
