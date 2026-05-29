export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseEnsureVersionStructureNormalization(executionState) {
    if (!executionState.payload.version) {
        return { valid: true, data: { version: 1 } };
    }
    return { valid: true };
}
