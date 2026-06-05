import { processDuplicateLearningMode } from "./processDuplicateLearningMode.js?v=1.1.62-external-task-review-loop";

export async function processGenerateModeFromPrimary(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    modeId: "primary",
    title: executionState.payload.title || "Generated Review Mode"
  });

  return processDuplicateLearningMode(executionState);
}
