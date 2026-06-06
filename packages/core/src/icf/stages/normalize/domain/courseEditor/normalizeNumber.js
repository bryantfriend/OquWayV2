export function normalizeCourseId(executionState) {
    const { payload } = executionState;
    if (payload.courseId && typeof payload.courseId === "string") {
        return { valid: true, data: { courseId: payload.courseId.trim() } };
    }
    return { valid: true };
}

export function normalizeNumber(executionState) {
    const { payload } = executionState;
    if (payload.value !== undefined && !isNaN(Number(payload.value)) && typeof payload.value !== "boolean") {
        return { valid: true, data: { value: Number(payload.value) } };
    }
    return { valid: true };
}
