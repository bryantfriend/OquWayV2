import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.80-course-module-command-center";

export function requireCourseCreatorOwnershipAuthorization(executionState) {
    const { context, actor } = executionState;

    if (hasAnyRole(actor, ["superAdmin", "platformAdmin"])) {
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
