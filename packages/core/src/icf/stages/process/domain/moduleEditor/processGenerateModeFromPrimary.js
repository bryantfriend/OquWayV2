import { processDuplicateLearningMode } from "./processDuplicateLearningMode.js?v=1.1.108-student-class-alias-merge";

export async function processGenerateModeFromPrimary(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    modeId: "primary",
    title: executionState.payload.title || "Generated Review Mode"
  });

  return processDuplicateLearningMode(executionState);
}
