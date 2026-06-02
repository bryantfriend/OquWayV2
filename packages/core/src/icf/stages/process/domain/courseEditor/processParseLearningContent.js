import { parseLearningContentText } from "../moduleEditor/learningArchitecture.js?v=1.1.29-module-render-fix";

export function processParseLearningContent(executionState) {
  var payload = executionState.payload || {};
  var parsed = parseLearningContentText(payload.rawText || payload.learningContentText || "");

  executionState.result = parsed;
  return { valid: true };
}
