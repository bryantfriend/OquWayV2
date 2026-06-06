function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogStepCreateProcessing(executionState) {
    const { payload, context } = executionState;

    executionState.result = {
        id: generateId(),
        moduleId: payload.moduleId,
        config: payload.config,
        order: payload.order || 0,
        createdAt: context.systemTimestamp,
        createdBy: context.createdBy
    };

    return { valid: true };
}

