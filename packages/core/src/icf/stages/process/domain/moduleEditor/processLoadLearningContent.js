import { createDefaultLearningContent } from "./learningArchitecture.js?v=1.1.54-multi-role-assistant";

export function processLoadLearningContent(executionState) {
  executionState.result = {
    learningContent: createDefaultLearningContent(executionState.context.module && executionState.context.module.learningContent)
  };

  return { valid: true };
}
