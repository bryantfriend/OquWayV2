import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.109-student-assignment-status-fallback";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
