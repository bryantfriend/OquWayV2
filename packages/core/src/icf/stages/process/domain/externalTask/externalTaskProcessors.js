import {
  createStudentExternalTaskResubmission,
  createStudentExternalTaskSubmission,
  getExternalTaskSubmissions,
  getStudentExternalTaskSubmissions,
  updateExternalTaskReview,
  uploadExternalTaskFile
} from "../../../../../../../domain/externalTasks/index.js?v=1.1.110-student-class-alias-query";

export async function processLoadExternalTaskStep(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};

  try {
    var submissions = await getStudentExternalTaskSubmissions({
      courseId: payload.courseId,
      assignmentId: payload.assignmentId || payload.courseAssignmentId,
      courseAssignmentId: payload.courseAssignmentId || payload.assignmentId,
      moduleId: payload.moduleId,
      stepId: payload.stepId,
      studentId: actor.id
    });

    executionState.result = {
      submission: readLatestSubmission(submissions),
      submissions: submissions
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("LoadExternalTaskStepIntent", executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_STEP_LOAD_FAILED", "Could not load external task status: " + readErrorMessage(error));
  }
}

export async function processUploadExternalTaskFile(executionState) {
  var payload = executionState.payload || {};

  try {
    var fileRecord = await uploadExternalTaskFile(payload, executionState.actor || {}, payload.submissionId, payload.file);
    executionState.result = {
      file: fileRecord
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("UploadExternalTaskFileIntent", executionState, error, "external-task-submissions");
    return createProcessError("EXTERNAL_TASK_FILE_UPLOAD_FAILED", "Could not upload proof file: " + readErrorMessage(error));
  }
}

export async function processSubmitExternalTask(executionState) {
  try {
    var submission = await createStudentExternalTaskSubmission(
      executionState.payload || {},
      executionState.actor || {},
      executionState.context.studentProfile || {}
    );

    executionState.result = {
      submission: submission
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("SubmitExternalTaskIntent", executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_SUBMIT_FAILED", "Could not submit external task: " + readErrorMessage(error));
  }
}

export async function processResubmitExternalTask(executionState) {
  try {
    var submission = await createStudentExternalTaskResubmission(
      executionState.payload || {},
      executionState.actor || {},
      executionState.context.studentProfile || {}
    );

    executionState.result = {
      submission: submission
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("ResubmitExternalTaskIntent", executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_RESUBMIT_FAILED", "Could not resubmit external task: " + readErrorMessage(error));
  }
}

export async function processLoadExternalTaskSubmissions(executionState) {
  try {
    var submissions = await getExternalTaskSubmissions(executionState.payload || {});
    executionState.result = {
      submissions: submissions
    };
    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("LoadExternalTaskSubmissionsIntent", executionState, error, "externalTaskSubmissions");
    return createProcessError("EXTERNAL_TASK_SUBMISSIONS_LOAD_FAILED", "Could not load external task submissions: " + readErrorMessage(error));
  }
}

export async function processReviewExternalTaskSubmission(executionState) {
  var payload = executionState.payload || {};
  var actor = executionState.actor || {};
  var teacherProfile = executionState.context && executionState.context.teacherProfile ? executionState.context.teacherProfile : null;
  var reviewerId = (executionState.context && executionState.context.profileUserId)
    || (teacherProfile && teacherProfile.profileUserId)
    || (teacherProfile && teacherProfile.id)
    || actor.id
    || "";

  try {
    var update = {
      status: payload.reviewStatus === "complete" ? "complete" : "submitted",
      reviewStatus: payload.reviewStatus,
      reviewedBy: reviewerId,
      teacherFeedback: payload.teacherFeedback || ""
    };

    await updateExternalTaskReview(payload.submissionId, update);

    executionState.result = {
      submissionId: payload.submissionId,
      reviewStatus: payload.reviewStatus,
      teacherFeedback: payload.teacherFeedback || ""
    };

    return { valid: true, data: executionState.result };
  } catch (error) {
    logExternalTaskProcessError("ReviewExternalTaskSubmissionIntent", executionState, error, "externalTaskSubmissions/" + payload.submissionId);
    return createProcessError("EXTERNAL_TASK_REVIEW_FAILED", "Could not save teacher review: " + readErrorMessage(error));
  }
}

function readLatestSubmission(submissions) {
  return Array.isArray(submissions) && submissions.length > 0 ? submissions[0] : null;
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

function logExternalTaskProcessError(intentName, executionState, error, path) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[external-task-debug] Process failed.", {
    intentName: executionState.intentType || intentName,
    actor: executionState.actor && executionState.actor.id ? executionState.actor.id : "unknown",
    path: path,
    firebaseErrorCode: error && error.code ? error.code : "",
    message: readErrorMessage(error)
  });
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  if (error.code && error.message) {
    return error.code + " " + error.message;
  }

  return error.message || String(error);
}
