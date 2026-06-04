export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeStepType(executionState) {
    const { payload } = executionState;
    if (payload.stepType && typeof payload.stepType === "string") {
        return { valid: true, data: { stepType: payload.stepType.trim() } };
    }
    return { valid: true };
}
