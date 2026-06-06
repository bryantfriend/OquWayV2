import { createDefaultLearningModes } from "./learningArchitecture.js?v=1.1.108-student-class-alias-merge";

export function processLoadLearningModes(executionState) {
  executionState.result = {
    learningModes: createDefaultLearningModes(
      executionState.context.module && executionState.context.module.learningModes,
      executionState.context.sessions
    )
  };

  return { valid: true };
}
