import { parseLearningContentText } from "../moduleEditor/learningArchitecture.js?v=1.1.114-student-profile-rules";

export function processParseLearningContent(executionState) {
  var payload = executionState.payload || {};
  var parsed = parseLearningContentText(payload.rawText || payload.learningContentText || "");

  executionState.result = parsed;
  return { valid: true };
}
