function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function catalogCourseCreateVersionProcessing(executionState) {
    const { payload, context } = executionState;

    const newVersion = {
        id: generateId(),
        courseId: payload.courseId,
        versionNumber: context.existingCourse.version + 1,
        status: "DRAFT",
        createdBy: context.createdBy,
        createdAt: context.systemTimestamp
    };

    executionState.result = newVersion;
    return { valid: true };
}

