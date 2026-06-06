export function preventModificationIfPublishedAuthorization(executionState) {
    const { context } = executionState;

    if (context && context.existingVersion) {
        if (context.existingVersion.status === "PUBLISHED") {
            return {
                valid: false,
                errors: [{ message: "Forbidden: Cannot modify a published version" }]
            };
        }
    }

    return { valid: true };
}

export function preventDeleteIfInUseAuthorization(executionState) {
    const { context } = executionState;

    if (context && context.existingCourse) {
        if (context.existingCourse.status === "PUBLISHED" || context.existingCourse.activeLearners > 0) {
            return {
                valid: false,
                errors: [{ message: "Forbidden: Cannot delete a course that is currently in use" }]
            };
        }
    }

    return { valid: true };
}
