import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.118-fruit-login-student-identity";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
