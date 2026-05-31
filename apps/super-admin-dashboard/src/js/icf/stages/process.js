export function callService(method) {
  return async function processServiceCall(executionState) {
    executionState.result = await method(executionState.payload, executionState.context);
    return { valid: true };
  };
}
