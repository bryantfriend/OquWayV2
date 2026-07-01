import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.82-shared-command-center-shell";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
