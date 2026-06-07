import { processDuplicateLearningMode } from "./processDuplicateLearningMode.js?v=1.1.110-student-class-alias-query";

export async function processGenerateModeFromPrimary(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    modeId: "primary",
    title: executionState.payload.title || "Generated Review Mode"
  });

  return processDuplicateLearningMode(executionState);
}
