import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.120-student-course-debug-summary";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
