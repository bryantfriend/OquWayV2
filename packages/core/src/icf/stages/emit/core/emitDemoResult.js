export function emitDemoResult(executionState) {
  const result = readResult(executionState);
  const completedStages = copyCompletedStages(result.completedStages);

  completedStages.push("Emit");

  return {
    ok: true,
    data: {
      success: true,
      completedStages: completedStages,
      contextChanges: readObject(result.contextChanges),
      resultData: readObject(result.resultData),
      warnings: readArray(executionState.warnings),
      errors: readArray(executionState.errors)
    }
  };
}

function readResult(executionState) {
  if (!executionState) {
    return {};
  }

  if (!executionState.result) {
    return {};
  }

  return executionState.result;
}

function readObject(value) {
  if (!value) {
    return {};
  }

  if (typeof value !== "object") {
    return {};
  }

  if (Array.isArray(value)) {
    return {};
  }

  return value;
}

function readArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
}

function copyCompletedStages(completedStages) {
  const copiedStages = [];
  let stageIndex = 0;

  if (!Array.isArray(completedStages)) {
    return copiedStages;
  }

  while (stageIndex < completedStages.length) {
    copiedStages.push(completedStages[stageIndex]);
    stageIndex = stageIndex + 1;
  }

  return copiedStages;
}
