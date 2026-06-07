import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.110-student-class-alias-query";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
