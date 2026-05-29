export function emitIntentResult(executionState) {
    return {
        valid: true,
        data: executionState.result
    };
}
