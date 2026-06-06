import { createDefaultLearningModes } from "./learningArchitecture.js?v=1.1.107-student-firebase-auth-chain";

export function processLoadLearningModes(executionState) {
  executionState.result = {
    learningModes: createDefaultLearningModes(
      executionState.context.module && executionState.context.module.learningModes,
      executionState.context.sessions
    )
  };

  return { valid: true };
}
