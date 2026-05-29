export function requireCourseCreatorOwnershipAuthorization(executionState) {
    const { context, actor } = executionState;

    if (actor && actor.role === "ROLE_SUPER_ADMIN") {
        return { valid: true }; // Super admin bypass
    }

    if (context && context.existingCourse) {
        if (context.existingCourse.createdBy !== actor.id) {
            return {
                valid: false,
                errors: [{ message: "Unauthorized: You do not own this course" }]
            };
        }
    }

    return { valid: true };
}
