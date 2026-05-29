// runStageArray.js

export async function runStageArray(stageFunctions, executionState, options) {
  const stageFunctionList = readStageFunctionList(stageFunctions);

  if (stageFunctionList === null) {
    return createStageFailureResult(
      "INVALID_STAGE_DEFINITION",
      "Stage definition must be an array."
    );
  }

  const allowMutation = readAllowMutationOption(options);
  let accumulatedData = null;
  let stageIndex = 0;

  while (stageIndex < stageFunctionList.length) {
    const stageFunction = stageFunctionList[stageIndex];
    const invalidStageResult = validateStageFunction(stageFunction, stageIndex);

    if (invalidStageResult) {
      return invalidStageResult;
    }

    const stateSnapshot = createStateSnapshot(executionState, allowMutation);
    const stageResult = await executeStageFunction(stageFunction, executionState);

    if (!stageResult.success) {
      return stageResult;
    }

    const mutationResult = validateStageMutation(executionState, allowMutation, stateSnapshot);

    if (!mutationResult.success) {
      return mutationResult;
    }

    const failedStageResult = createFailedStageResult(stageResult.value);

    if (failedStageResult) {
      return failedStageResult;
    }

    accumulatedData = mergeAccumulatedData(accumulatedData, stageResult.value);
    stageIndex = stageIndex + 1;
  }

  return createSuccessfulStageArrayResult(accumulatedData);
}


/* -------------------------------
   INTERNAL HELPERS
-------------------------------- */

function readStageFunctionList(stageFunctions) {
  if (Array.isArray(stageFunctions)) {
    return stageFunctions;
  }

  if (typeof stageFunctions === "undefined") {
    return [];
  }

  if (stageFunctions === null) {
    console.warn("[ICF] Stage array is null, treating as empty pass-through.");
    return [];
  }

  return null;
}

function readAllowMutationOption(options) {
  if (!options) {
    return false;
  }

  return options.allowMutation === true;
}

function validateStageFunction(stageFunction, stageIndex) {
  if (typeof stageFunction === "function") {
    return null;
  }

  return createStageFailureResult(
    "INVALID_STAGE_FUNCTION",
    "Stage item at index " + stageIndex + " is not a function."
  );
}

async function executeStageFunction(stageFunction, executionState) {
  try {
    const returnValue = await stageFunction(executionState);

    return {
      success: true,
      value: returnValue
    };
  } catch (error) {
    const functionName = getStageFunctionName(stageFunction);
    return createWrappedExecutionErrorResult(error, functionName);
  }
}

function getStageFunctionName(stageFunction) {
  if (stageFunction && stageFunction.name) {
    return stageFunction.name;
  }

  return "anonymous";
}

function createWrappedExecutionErrorResult(error, functionName) {
  let message = error.message || "Unknown error";

  if (functionName) {
    message = functionName + ": " + message;
  }

  return {
    success: false,
    errors: [
      {
        code: "STAGE_EXECUTION_ERROR",
        message: message
      }
    ]
  };
}

function createStateSnapshot(executionState, allowMutation) {
  if (allowMutation) {
    return null;
  }

  return JSON.stringify(executionState);
}

function validateStageMutation(executionState, allowMutation, stateSnapshot) {
  if (allowMutation) {
    return { success: true };
  }

  if (!hasStateChanged(stateSnapshot, executionState)) {
    return { success: true };
  }

  return createStageFailureResult(
    "ILLEGAL_STATE_MUTATION",
    "State mutation detected during " + executionState.currentStage + " stage."
  );
}

function hasStateChanged(snapshot, currentState) {
  if (!snapshot) {
    return false;
  }

  return snapshot !== JSON.stringify(currentState);
}

function createFailedStageResult(stageResult) {
  if (!didStageFail(stageResult)) {
    return null;
  }

  return {
    success: false,
    errors: normalizeStageErrors(stageResult)
  };
}

function didStageFail(stageResult) {
  // null/undefined = pass-through success (ICF.md blank stage pattern)
  if (stageResult === null || typeof stageResult === "undefined") {
    return false;
  }

  // ICF.md convention
  if (stageResult.ok === false) {
    return true;
  }

  // Current engine conventions (backward compat)
  if (stageResult.valid === false) {
    return true;
  }

  if (stageResult.authorized === false) {
    return true;
  }

  if (stageResult.success === false) {
    return true;
  }

  return false;
}

function normalizeStageErrors(stageResult) {
  if (stageResult && stageResult.error) {
    return [{ code: stageResult.error }];
  }

  if (stageResult && Array.isArray(stageResult.errors) && stageResult.errors.length > 0) {
    return stageResult.errors;
  }

  if (stageResult && stageResult.reason) {
    return [{ code: "STAGE_FAILURE", message: stageResult.reason }];
  }

  return [
    {
      code: "STAGE_FAILURE",
      message: "Stage returned failure without error details."
    }
  ];
}

function mergeAccumulatedData(accumulatedData, stageResult) {
  if (!stageResult || typeof stageResult.data === "undefined") {
    return accumulatedData;
  }

  if (isMergeableObject(stageResult.data)) {
    return Object.assign({}, accumulatedData || {}, stageResult.data);
  }

  return stageResult.data;
}

function isMergeableObject(value) {
  if (typeof value !== "object") {
    return false;
  }

  if (value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return true;
}

function createSuccessfulStageArrayResult(accumulatedData) {
  return {
    success: true,
    data: accumulatedData
  };
}

function createStageFailureResult(code, message) {
  return {
    success: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}
