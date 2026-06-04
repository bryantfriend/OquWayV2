import {
  createLearningModesForTemplate,
  createStarterStepsForMode,
  normalizeLearningContentPayload
} from "../moduleEditor/learningArchitecture.js?v=1.1.54-multi-role-assistant";

export function processGenerateStarterSteps(executionState) {
  var payload = executionState.payload || {};
  var learningContent = normalizeLearningContentPayload(payload);
  var modes = createLearningModesForTemplate(payload.templateKey || "custom", []);
  var modeIds = Object.keys(modes);
  var stepsByMode = {};
  var stepCount = 0;
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    var mode = modes[modeIds[modeIndex]];
    var steps = createStarterStepsForMode(mode, learningContent, { generatedAt: Date.now() });
    stepsByMode[mode.id] = steps;
    stepCount = stepCount + steps.length;
    modeIndex = modeIndex + 1;
  }

  executionState.result = {
    learningContent: learningContent,
    modes: modes,
    stepsByMode: stepsByMode,
    stepCount: stepCount
  };
  return { valid: true };
}
