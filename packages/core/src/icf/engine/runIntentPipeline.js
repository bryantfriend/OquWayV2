// runIntentPipeline.js

import { runStageArray } from "./runStageArray.js?v=1.1.162-modal-stack";
import { buildResult } from "./buildResult.js?v=1.1.162-modal-stack";

export async function runIntentPipeline(intentDefinition, executionInput) {
  const executionState = createExecutionState(intentDefinition, executionInput);
  const intentDefinitionErrors = validateIntentDefinition(intentDefinition);

  if (intentDefinitionErrors.length > 0) {
    executionState.errors = intentDefinitionErrors;
    return finalizeExecutionState(executionState);
  }

  logPipelineStarted(executionState);

  try {
    if (!await runValidateStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }

    if (!await runNormalizeStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }

    if (!await runAddContextStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }

    if (!await runAuthorizeStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }

    if (!await runProcessStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }

    if (!await runEmitStage(intentDefinition, executionState)) {
      return finalizeExecutionState(executionState);
    }
  } catch (error) {
    executionState.errors = executionState.errors.concat(
      createUnexpectedPipelineErrors(error)
    );
  }

  return finalizeExecutionState(executionState);
}


/* -------------------------------
   EXECUTION STATE
-------------------------------- */

function createExecutionState(intentDefinition, executionInput) {
  return {
    intentType: readIntentType(intentDefinition),
    payload: readExecutionPayload(executionInput),
    actor: readExecutionActor(executionInput),
    context: {},
    result: null,
    errors: [],
    warnings: [],
    meta: readExecutionMeta(executionInput),
    startTime: Date.now(),
    endTime: null,
    currentStage: null
  };
}

function readIntentType(intentDefinition) {
  if (intentDefinition && intentDefinition.type) {
    return intentDefinition.type;
  }

  return "UnknownIntent";
}

function readExecutionPayload(executionInput) {
  if (executionInput && executionInput.payload) {
    return executionInput.payload;
  }

  return {};
}

function readExecutionActor(executionInput) {
  if (executionInput && executionInput.actor) {
    return executionInput.actor;
  }

  return null;
}

function readExecutionMeta(executionInput) {
  if (executionInput && executionInput.meta) {
    return executionInput.meta;
  }

  return {
    createdAt: Date.now(),
    source: "system"
  };
}


/* -------------------------------
   INTENT DEFINITION VALIDATION
-------------------------------- */

function validateIntentDefinition(intentDefinition) {
  const errors = [];

  if (!intentDefinition) {
    errors.push(createIntentDefinitionError(
      "MISSING_INTENT_DEFINITION",
      "Intent definition is required."
    ));
    return errors;
  }

  if (!intentDefinition.type) {
    errors.push(createIntentDefinitionError(
      "MISSING_INTENT_TYPE",
      "Intent definition must include a type."
    ));
  }

  appendStageDefinitionErrors(errors, intentDefinition);
  return errors;
}

function appendStageDefinitionErrors(errors, intentDefinition) {
  const requiredStageNames = createRequiredStageNames();
  let stageIndex = 0;

  while (stageIndex < requiredStageNames.length) {
    appendStageDefinitionError(errors, intentDefinition, requiredStageNames[stageIndex]);
    stageIndex = stageIndex + 1;
  }
}

function createRequiredStageNames() {
  return [
    "validate",
    "normalize",
    "addContext",
    "authorize",
    "process",
    "emit"
  ];
}

function appendStageDefinitionError(errors, intentDefinition, stageName) {
  if (!Object.prototype.hasOwnProperty.call(intentDefinition, stageName)) {
    errors.push(createIntentDefinitionError(
      "MISSING_INTENT_STAGE",
      "Intent " + intentDefinition.type + " is missing required stage: " + stageName + "."
    ));
    return;
  }

  if (!Array.isArray(intentDefinition[stageName])) {
    errors.push(createIntentDefinitionError(
      "INVALID_INTENT_STAGE",
      "Intent " + intentDefinition.type + " stage must be an array: " + stageName + "."
    ));
  }
}

function createIntentDefinitionError(code, message) {
  return {
    code: code,
    message: message
  };
}


/* -------------------------------
   STAGE RUNNERS
-------------------------------- */

async function runValidateStage(intentDefinition, executionState) {
  return runReadOnlyStage(
    intentDefinition.validate,
    executionState,
    "validate"
  );
}

async function runNormalizeStage(intentDefinition, executionState) {
  const stageResult = await runReadOnlyStageWithResult(
    intentDefinition.normalize,
    executionState,
    "normalize"
  );

  if (!stageResult.success) {
    return false;
  }

  applyPayloadData(executionState, stageResult.data);
  return true;
}

async function runAddContextStage(intentDefinition, executionState) {
  const stageResult = await runReadOnlyStageWithResult(
    intentDefinition.addContext,
    executionState,
    "addContext"
  );

  if (!stageResult.success) {
    return false;
  }

  applyContextData(executionState, stageResult.data);
  return true;
}

async function runAuthorizeStage(intentDefinition, executionState) {
  return runReadOnlyStage(
    intentDefinition.authorize,
    executionState,
    "authorize"
  );
}

async function runProcessStage(intentDefinition, executionState) {
  executionState.currentStage = "process";

  const processingResult = await runStageArray(
    intentDefinition.process,
    executionState,
    { allowMutation: true }
  );

  if (!processingResult.success) {
    executionState.errors = executionState.errors.concat(
      enrichErrorsWithStage(processingResult.errors, "process")
    );
    logStageFailed(executionState, "process");
    return false;
  }

  applyProcessingResult(executionState, processingResult.data);
  logStagePassed("process");
  return true;
}

async function runEmitStage(intentDefinition, executionState) {
  const stageResult = await runReadOnlyStageWithResult(
    intentDefinition.emit,
    executionState,
    "emit"
  );

  if (!stageResult.success) {
    return false;
  }

  applyEmitResult(executionState, stageResult.data);
  return true;
}


/* -------------------------------
   READ-ONLY STAGE HELPERS
-------------------------------- */

async function runReadOnlyStage(stageFunctions, executionState, stageName) {
  const stageResult = await runReadOnlyStageWithResult(
    stageFunctions,
    executionState,
    stageName
  );

  return stageResult.success;
}

async function runReadOnlyStageWithResult(stageFunctions, executionState, stageName) {
  executionState.currentStage = stageName;

  const stageResult = await runStageArray(
    stageFunctions,
    executionState,
    { allowMutation: false }
  );

  if (!stageResult.success) {
    executionState.errors = executionState.errors.concat(
      enrichErrorsWithStage(stageResult.errors, stageName)
    );
    logStageFailed(executionState, stageName);
  } else {
    logStagePassed(stageName);
  }

  return stageResult;
}


/* -------------------------------
   STATE APPLICATORS
-------------------------------- */

function applyPayloadData(executionState, stageData) {
  if (typeof stageData === "undefined" || stageData === null) {
    return;
  }

  executionState.payload = Object.assign({}, executionState.payload, stageData);
}

function applyContextData(executionState, stageData) {
  if (typeof stageData === "undefined" || stageData === null) {
    return;
  }

  executionState.context = Object.assign({}, executionState.context, stageData);
}

function applyProcessingResult(executionState, stageData) {
  if (stageData === null || typeof stageData === "undefined") {
    return;
  }

  executionState.result = stageData;
}

function applyEmitResult(executionState, stageData) {
  if (stageData === null || typeof stageData === "undefined") {
    return;
  }

  executionState.result = stageData;
}


/* -------------------------------
   ERROR HELPERS
-------------------------------- */

function createUnexpectedPipelineErrors(error) {
  return [
    {
      code: "UNEXPECTED_PIPELINE_ERROR",
      message: error.message || "An unexpected error occurred in the pipeline."
    }
  ];
}

function enrichErrorsWithStage(errors, stageName) {
  if (!Array.isArray(errors)) {
    return [];
  }

  const enriched = [];
  let errorIndex = 0;

  while (errorIndex < errors.length) {
    const originalError = errors[errorIndex];
    const enrichedError = Object.assign({}, originalError);

    if (!enrichedError.stage) {
      enrichedError.stage = stageName;
    }

    enriched.push(enrichedError);
    errorIndex = errorIndex + 1;
  }

  return enriched;
}

function finalizeExecutionState(executionState) {
  executionState.endTime = Date.now();
  logPipelineCompleted(executionState);
  return buildResult(executionState);
}


/* -------------------------------
   ICF LOGGING
-------------------------------- */

function logPipelineStarted(executionState) {
  let actorId = "unknown";

  if (executionState.actor && executionState.actor.id) {
    actorId = executionState.actor.id;
  }

  console.info("[ICF] Pipeline started:", executionState.intentType, "Actor:", actorId);
}

function logStagePassed(stageName) {
  console.info("[ICF] Stage passed:", stageName);
}

function logStageFailed(executionState, stageName) {
  console.warn("[ICF] Stage failed:", stageName, "Intent:", executionState.intentType);
}

function logPipelineCompleted(executionState) {
  const success = executionState.errors.length === 0;
  console.info("[ICF] Pipeline completed:", executionState.intentType, "Success:", success);
}
