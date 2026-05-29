export function catalogCourseTrimTitleNormalization(executionState) {
    if (executionState.payload.title && typeof executionState.payload.title === "string") {
        return { valid: true, data: { title: executionState.payload.title.trim() } };
    }
    return { valid: true };
}

export function catalogCourseGenerateSlugNormalization(executionState) {
    if (executionState.payload.title && !executionState.payload.slug) {
        const slug = executionState.payload.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        return { valid: true, data: { slug: slug } };
    }
    return { valid: true };
}
