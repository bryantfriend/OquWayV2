export function normalizeDemoPayload(executionState) {
  const message = executionState.payload.message;
  const completedStages = createCompletedStagesAfterNormalize(executionState);

  if (typeof message === "string") {
    return {
      ok: true,
      data: {
        message: message.trim(),
        completedStages: completedStages,
        normalizeMarker: "Normalize"
      }
    };
  }

  return {
    ok: true,
    data: {
      completedStages: completedStages,
      normalizeMarker: "Normalize"
    }
  };
}

function createCompletedStagesAfterNormalize(executionState) {
  const completedStages = [];

  if (executionState.payload && executionState.payload.validateMarker) {
    completedStages.push(executionState.payload.validateMarker);
  } else {
    completedStages.push("Validate");
  }

  completedStages.push("Normalize");
  return completedStages;
}
