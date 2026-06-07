import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.121-student-dashboard-open-clean";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
