import {
  createDefaultStepConfig,
  getStepTypeDefinition,
  isSupportedStepType,
  listStepTypeDefinitions,
  normalizeStepType
} from "../../core/src/shared/stepTypes/stepTypeRegistry.js?v=1.1.226-learning-activity-files";

export {
  createDefaultStepConfig,
  getStepTypeDefinition,
  isSupportedStepType,
  listStepTypeDefinitions,
  normalizeStepType
};

export function getStepType(stepTypeId) {
  return getStepTypeDefinition(stepTypeId);
}

export function getDefaultStepConfig(stepTypeId, config) {
  return createDefaultStepConfig(stepTypeId, config);
}

export function validateStepConfig(stepData) {
  var stepType = readStepType(stepData);

  return {
    valid: Boolean(stepType && isSupportedStepType(stepType)),
    stepType: stepType || ""
  };
}

export function readStepType(stepData) {
  var config = stepData && stepData.config && typeof stepData.config === "object" && !Array.isArray(stepData.config) ? stepData.config : {};
  var stepType = stepData && (stepData.type || stepData.stepType || stepData.stepTypeId || stepData.activityType || config.type || config.stepType || config.activityType);

  return normalizeStepType(stepType || "");
}
