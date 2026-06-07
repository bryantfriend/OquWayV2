import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.111-student-assignment-debug-panel";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
