import { createDefaultLearningModes } from "./learningArchitecture.js";

export function processLoadLearningModes(executionState) {
  executionState.result = {
    learningModes: createDefaultLearningModes(
      executionState.context.module && executionState.context.module.learningModes,
      executionState.context.sessions
    )
  };

  return { valid: true };
}
