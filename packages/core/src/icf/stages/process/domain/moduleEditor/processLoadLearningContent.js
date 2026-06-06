import { createDefaultLearningContent } from "./learningArchitecture.js?v=1.1.79-user-command-center";

export function processLoadLearningContent(executionState) {
  executionState.result = {
    learningContent: createDefaultLearningContent(executionState.context.module && executionState.context.module.learningContent)
  };

  return { valid: true };
}
