import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.120-student-course-debug-summary";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
