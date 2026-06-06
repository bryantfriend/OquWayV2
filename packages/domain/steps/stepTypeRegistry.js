import {
  createDefaultStepConfig,
  getStepTypeDefinition,
  isSupportedStepType,
  listStepTypeDefinitions
} from "../../core/src/shared/stepTypes/stepTypeRegistry.js?v=1.1.79-user-command-center";

export {
  createDefaultStepConfig,
  getStepTypeDefinition,
  isSupportedStepType,
  listStepTypeDefinitions
};

export function getStepType(stepTypeId) {
  return getStepTypeDefinition(stepTypeId);
}

export function getDefaultStepConfig(stepTypeId, config) {
  return createDefaultStepConfig(stepTypeId, config);
}

export function validateStepConfig(stepData) {
  var stepType = stepData && (stepData.type || stepData.stepType || stepData.stepTypeId);

  return {
    valid: Boolean(stepType && isSupportedStepType(stepType)),
    stepType: stepType || ""
  };
}
