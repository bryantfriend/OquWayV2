import { createDefaultLearningContent } from "./learningArchitecture.js?v=1.1.110-student-class-alias-query";

export function processLoadLearningContent(executionState) {
  executionState.result = {
    learningContent: createDefaultLearningContent(executionState.context.module && executionState.context.module.learningContent)
  };

  return { valid: true };
}
