import { createDefaultLearningContent } from "./learningArchitecture.js?v=1.1.121-student-dashboard-open-clean";

export function processLoadLearningContent(executionState) {
  executionState.result = {
    learningContent: createDefaultLearningContent(executionState.context.module && executionState.context.module.learningContent)
  };

  return { valid: true };
}
