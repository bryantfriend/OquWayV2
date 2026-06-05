import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.63-external-task-student-feedback";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
