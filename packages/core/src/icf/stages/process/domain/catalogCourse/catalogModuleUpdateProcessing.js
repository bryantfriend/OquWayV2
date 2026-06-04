function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogModuleUpdateProcessing(executionState) {
    const { payload, context } = executionState;

    executionState.result = {
        id: payload.moduleId,
        ...context.existingModule,
        title: payload.title || context.existingModule.title,
        updatedAt: context.systemTimestamp,
        updatedBy: context.updatedBy
    };

    return { valid: true };
}

