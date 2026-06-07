import { hasAnyRole } from "../../core/roleAuthorization.js?v=1.1.120-student-course-debug-summary";

export function requireCourseCreatorAuthorization(executionState) {
    if (!executionState.actor) {
        return { valid: false, errors: [{ message: "Unauthorized: Actor required" }] };
    }

    if (hasAnyRole(executionState.actor, [
        "superAdmin",
        "platformAdmin",
        "admin",
        "schoolAdmin",
        "courseCreator",
        "assistant",
        "editor"
    ])) {
        return { valid: true };
    }

    return { valid: false, errors: [{ message: "Unauthorized: Must be a Course Creator" }] };
}
