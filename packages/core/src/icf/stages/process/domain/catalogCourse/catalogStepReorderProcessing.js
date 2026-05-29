function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogStepReorderProcessing(executionState) {
    const { payload } = executionState;

    executionState.result = {
        moduleId: payload.moduleId,
        reorderedSteps: payload.steps // Expects { id, newOrder }
    };

    return { valid: true };
}

