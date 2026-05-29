export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeBoolean(executionState) {
    const { payload } = executionState;
    if (payload.value !== undefined && (payload.value === "true" || payload.value === "false")) {
        return { valid: true, data: { value: payload.value === "true" } };
    }
    return { valid: true };
}
