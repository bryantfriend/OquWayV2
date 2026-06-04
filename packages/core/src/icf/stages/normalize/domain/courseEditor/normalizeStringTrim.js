export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeStringTrim(executionState) {
    const { payload } = executionState;
    if (payload.value && typeof payload.value === "string") {
        return { valid: true, data: { value: payload.value.trim() } };
    }
    return { valid: true };
}
