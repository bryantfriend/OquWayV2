import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.119-student-dashboard-debug-safe";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
