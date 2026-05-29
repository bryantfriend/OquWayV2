export function attachDemoContext(executionState) {
  const completedStages = createCompletedStagesAfterAddContext(executionState);

  return {
    ok: true,
    data: {
      demoVerified: true,
      addContextMarker: "AddContext",
      completedStages: completedStages,
      verifiedAt: Date.now()
    }
  };
}

function createCompletedStagesAfterAddContext(executionState) {
  const completedStages = [];
  const payloadStages = readPayloadStages(executionState);
  let stageIndex = 0;

  while (stageIndex < payloadStages.length) {
    completedStages.push(payloadStages[stageIndex]);
    stageIndex = stageIndex + 1;
  }

  completedStages.push("AddContext");
  return completedStages;
}

function readPayloadStages(executionState) {
  if (!executionState.payload) {
    return [];
  }

  if (!Array.isArray(executionState.payload.completedStages)) {
    return [];
  }

  return executionState.payload.completedStages;
}
