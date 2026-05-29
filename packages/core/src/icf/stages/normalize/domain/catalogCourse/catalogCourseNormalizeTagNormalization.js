export function catalogCourseNormalizeTagNormalization(executionState) {
    if (!executionState.payload.tag) {
        return { valid: true };
    }

    return {
        valid: true,
        data: {
            tag: executionState.payload.tag.trim().toLowerCase()
        }
    };
}
