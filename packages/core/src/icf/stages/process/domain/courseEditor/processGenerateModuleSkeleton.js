import {
  createLearningModesForTemplate,
  createStarterStepsForMode,
  normalizeLearningContentPayload
} from "../moduleEditor/learningArchitecture.js?v=1.1.78-location-command-center";

export function processGenerateModuleSkeleton(executionState) {
  var payload = executionState.payload || {};
  var learningContent = normalizeLearningContentPayload(payload);
  var learningModes = createLearningModesForTemplate(payload.templateKey || "custom", []);
  var stepsByMode = {};
  var modeIds = Object.keys(learningModes);
  var generatedStepCount = 0;
  var modeIndex = 0;

  while (modeIndex < modeIds.length) {
    var mode = learningModes[modeIds[modeIndex]];
    var steps = payload.generateStarterSteps === false
      ? []
      : createStarterStepsForMode(mode, learningContent, { generatedAt: Date.now() });

    stepsByMode[mode.id] = steps;
    generatedStepCount = generatedStepCount + steps.length;
    modeIndex = modeIndex + 1;
  }

  executionState.result = {
    module: {
      title: payload.title,
      description: payload.description,
      subject: payload.subject || "",
      topic: payload.topic || "",
      level: payload.level || payload.grade || "",
      estimatedMinutes: payload.estimatedMinutes || 15,
      language: payload.language || "en",
      templateKey: payload.templateKey || "custom",
      learningContent: learningContent,
      learningModes: learningModes
    },
    stepsByMode: stepsByMode,
    generatedStepCount: generatedStepCount
  };

  return { valid: true };
}
