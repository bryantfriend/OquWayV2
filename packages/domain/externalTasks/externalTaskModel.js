import { readSafeString } from "../../shared/utils/index.js";

export function normalizeExternalTaskSubmission(submission) {
  var safeSubmission = submission || {};

  return Object.assign({}, safeSubmission, {
    id: readSafeString(safeSubmission.id || safeSubmission.submissionId),
    submissionId: readSafeString(safeSubmission.submissionId || safeSubmission.id),
    studentId: readSafeString(safeSubmission.studentId),
    courseId: readSafeString(safeSubmission.courseId),
    assignmentId: readSafeString(safeSubmission.assignmentId || safeSubmission.courseAssignmentId),
    courseAssignmentId: readSafeString(safeSubmission.courseAssignmentId || safeSubmission.assignmentId),
    moduleId: readSafeString(safeSubmission.moduleId),
    modeId: readSafeString(safeSubmission.modeId || safeSubmission.practiceModeKey),
    stepId: readSafeString(safeSubmission.stepId),
    status: readSafeString(safeSubmission.status || "submitted") || "submitted",
    reviewStatus: normalizeExternalTaskReviewStatus(safeSubmission.reviewStatus),
    teacherFeedback: readSafeString(safeSubmission.teacherFeedback),
    files: Array.isArray(safeSubmission.files) ? safeSubmission.files.slice() : [],
    attemptNumber: readAttemptNumber(safeSubmission.attemptNumber),
    previousSubmissionId: readSafeString(safeSubmission.previousSubmissionId)
  });
}

export function normalizeExternalTaskReviewStatus(reviewStatus) {
  var status = readSafeString(reviewStatus || "pending");

  if (status === "complete" || status === "needsWork" || status === "incomplete") {
    return status;
  }

  return "pending";
}

export function isReviewedExternalTaskSubmission(submission) {
  var status = normalizeExternalTaskReviewStatus(submission && submission.reviewStatus);
  return status === "complete" || status === "needsWork" || status === "incomplete";
}

export function isExternalTaskSubmissionComplete(submission) {
  return normalizeExternalTaskReviewStatus(submission && submission.reviewStatus) === "complete";
}

export function canResubmitExternalTaskSubmission(submission) {
  var status = normalizeExternalTaskReviewStatus(submission && submission.reviewStatus);
  return status === "needsWork" || status === "incomplete";
}

export function readExternalTaskAttemptNumber(submissions) {
  var maxAttempt = 0;
  var index = 0;
  var safeSubmissions = Array.isArray(submissions) ? submissions : [];

  while (index < safeSubmissions.length) {
    maxAttempt = Math.max(maxAttempt, readAttemptNumber(safeSubmissions[index].attemptNumber));
    index = index + 1;
  }

  return maxAttempt + 1;
}

function readAttemptNumber(value) {
  var numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.round(numberValue) : 1;
}
