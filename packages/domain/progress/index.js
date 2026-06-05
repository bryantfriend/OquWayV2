export function createEmptyProgressSummary() {
  return {
    completedStepCount: 0,
    totalStepCount: 0,
    completedModuleCount: 0,
    totalModuleCount: 0
  };
}

export function isStepComplete(progress, stepId) {
  var completedStepIds = progress && Array.isArray(progress.completedStepIds) ? progress.completedStepIds : [];
  return completedStepIds.indexOf(stepId) !== -1;
}
