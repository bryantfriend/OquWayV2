import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.112-student-assignment-error-debug";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
