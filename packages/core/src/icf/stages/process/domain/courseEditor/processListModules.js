export function processListModules(executionState) {
  const context = executionState.context;

  executionState.result = readModules(context);
  return { valid: true };
}

function readModules(context) {
  if (!context) {
    return [];
  }

  if (!Array.isArray(context.modules)) {
    return [];
  }

  return context.modules;
}
