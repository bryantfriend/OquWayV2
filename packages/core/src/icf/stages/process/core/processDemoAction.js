export function processDemoAction(executionState) {
  const completedStages = createCompletedStagesAfterProcess(executionState);

  return {
    ok: true,
    data: {
      echo: executionState.payload.message,
      completedStages: completedStages,
      contextChanges: {
        demoVerified: executionState.context.demoVerified,
        addContextMarker: executionState.context.addContextMarker,
        verifiedAt: executionState.context.verifiedAt
      },
      resultData: {
        echo: executionState.payload.message,
        processedBy: executionState.actor.id
      },
      processedAt: Date.now(),
      processedBy: executionState.actor.id
    }
  };
}

function createCompletedStagesAfterProcess(executionState) {
  const completedStages = [];
  const contextStages = readContextStages(executionState);
  let stageIndex = 0;

  while (stageIndex < contextStages.length) {
    completedStages.push(contextStages[stageIndex]);
    stageIndex = stageIndex + 1;
  }

  completedStages.push("Authorize");
  completedStages.push("Process");
  return completedStages;
}

function readContextStages(executionState) {
  if (!executionState.context) {
    return [];
  }

  if (!Array.isArray(executionState.context.completedStages)) {
    return [];
  }

  return executionState.context.completedStages;
}
