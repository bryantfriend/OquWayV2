import { createPulledStepDraft } from "./learningArchitecture.js?v=1.1.111-student-assignment-debug-panel";

export function processPullLearningContent(executionState) {
  var learningContent = executionState.context.module && executionState.context.module.learningContent;

  executionState.result = {
    stepDraft: createPulledStepDraft(executionState.payload, learningContent),
    source: executionState.payload.source || "vocabulary",
    writes: false
  };

  return { valid: true };
}
