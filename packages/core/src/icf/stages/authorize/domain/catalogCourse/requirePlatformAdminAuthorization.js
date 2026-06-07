import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.116-student-token-ready";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
