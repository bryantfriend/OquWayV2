import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.162-modal-stack";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
