export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseDefaultStatusNormalization(executionState) {
    if (!executionState.payload.status) {
        return { valid: true, data: { status: "DRAFT" } };
    }
    return { valid: true };
}
