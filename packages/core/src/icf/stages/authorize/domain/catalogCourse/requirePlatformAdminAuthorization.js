import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.117-student-identity-binding";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
