export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseLowercaseTagsNormalization(executionState) {
    if (executionState.payload.tags && Array.isArray(executionState.payload.tags)) {
        return {
            valid: true,
            data: {
                tags: executionState.payload.tags.map(function (tag) {
                    return typeof tag === "string" ? tag.trim().toLowerCase() : tag;
                })
            }
        };
    } else if (!executionState.payload.tags) {
        return { valid: true, data: { tags: [] } };
    }
    return { valid: true };
}
