import { processDuplicateLearningMode } from "./processDuplicateLearningMode.js?v=1.1.121-student-dashboard-open-clean";

export async function processGenerateModeFromPrimary(executionState) {
  executionState.payload = Object.assign({}, executionState.payload, {
    modeId: "primary",
    title: executionState.payload.title || "Generated Review Mode"
  });

  return processDuplicateLearningMode(executionState);
}
