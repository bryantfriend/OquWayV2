import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.29-module-render-fix";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
