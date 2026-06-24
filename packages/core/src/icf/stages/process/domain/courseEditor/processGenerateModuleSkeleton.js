import {
  createLearningModesForTemplate,
  createStarterStepsForMode,
  normalizeLearningContentPayload
} from "../moduleEditor/learningArchitecture.js?v=1.1.162-modal-stack";

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

  var module = {
    title: payload.title,
    description: payload.description,
    subject: payload.subject || "",
    topic: payload.topic || "",
    level: payload.level || payload.grade || "",
    language: payload.language || "en",
    templateKey: payload.templateKey || "custom",
    learningContent: learningContent,
    learningModes: learningModes
  };
  var estimatedMinutes = readOptionalPositiveWholeNumber(payload.estimatedMinutes);

  if (estimatedMinutes) {
    module.estimatedMinutes = estimatedMinutes;
  }

  executionState.result = {
    module: module,
    stepsByMode: stepsByMode,
    generatedStepCount: generatedStepCount
  };

  return { valid: true };
}

function readOptionalPositiveWholeNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  var numberValue = Number(value);

  if (Number.isInteger(numberValue) && numberValue > 0) {
    return numberValue;
  }

  return null;
}
