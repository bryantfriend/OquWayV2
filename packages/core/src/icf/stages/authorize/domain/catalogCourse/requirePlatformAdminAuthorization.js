import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.108-student-class-alias-merge";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
