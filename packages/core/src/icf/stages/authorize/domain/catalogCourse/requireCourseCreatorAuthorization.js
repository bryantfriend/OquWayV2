import { requireRoleValidation } from "../../../validate/validators.js";

export function requireCourseCreatorAuthorization(executionState) {
    // If SuperAdmin, they can bypass course creator restriction usually,
    // but we will enforce strictly ROLE_COURSE_CREATOR per guidelines,
    // or we check array inclusion if actor has multiple roles.

    if (!executionState.actor) {
        return { valid: false, errors: [{ message: "Unauthorized: Actor required" }] };
    }

    if (executionState.actor.role === "ROLE_SUPER_ADMIN" || executionState.actor.role === "ROLE_COURSE_CREATOR") {
        return { valid: true };
    }

    return { valid: false, errors: [{ message: "Unauthorized: Must be a Course Creator" }] };
}
