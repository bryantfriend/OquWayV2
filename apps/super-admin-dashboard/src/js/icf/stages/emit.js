export function emitResult(executionState) {
  executionState.result = {
    success: true,
    data: executionState.result
  };

  return { valid: true };
}
