import { createPulledStepDraft } from "./learningArchitecture.js";

export function processPullLearningContent(executionState) {
  var learningContent = executionState.context.module && executionState.context.module.learningContent;

  executionState.result = {
    stepDraft: createPulledStepDraft(executionState.payload, learningContent),
    source: executionState.payload.source || "vocabulary",
    writes: false
  };

  return { valid: true };
}
