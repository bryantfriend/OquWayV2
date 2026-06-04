function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogCoursePublishVersionProcessing(executionState) {
    const { payload, context } = executionState;

    executionState.result = {
        id: payload.versionId,
        ...context.existingVersion,
        status: "PUBLISHED",
        publishedBy: context.updatedBy,
        publishedAt: context.systemTimestamp
    };

    return { valid: true };
}

