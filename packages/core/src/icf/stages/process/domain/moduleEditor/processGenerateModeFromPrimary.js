import { processDuplicateLearningMode } from "./processDuplicateLearningMode.js?v=1.1.113-student-rules-read";

export async function processGenerateModeFromPrimary(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    modeId: "primary",
    title: executionState.payload.title || "Generated Review Mode"
  });

  return processDuplicateLearningMode(executionState);
}
