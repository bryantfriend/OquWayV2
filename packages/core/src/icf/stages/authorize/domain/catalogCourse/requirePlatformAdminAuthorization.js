import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.114-student-profile-rules";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
