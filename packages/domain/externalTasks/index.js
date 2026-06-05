import { readSafeString } from "../../shared/utils/index.js";

export function normalizeExternalTaskSubmission(submission) {
  var safeSubmission = submission || {};

  return Object.assign({}, safeSubmission, {
    id: readSafeString(safeSubmission.id || safeSubmission.submissionId),
    studentId: readSafeString(safeSubmission.studentId),
    courseId: readSafeString(safeSubmission.courseId),
    moduleId: readSafeString(safeSubmission.moduleId),
    stepId: readSafeString(safeSubmission.stepId),
    reviewStatus: readSafeString(safeSubmission.reviewStatus || "pending") || "pending"
  });
}

export function isReviewedExternalTaskSubmission(submission) {
  var status = readSafeString(submission && submission.reviewStatus);
  return status === "complete" || status === "needsWork" || status === "incomplete";
}
