import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.62-external-task-review-loop";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
