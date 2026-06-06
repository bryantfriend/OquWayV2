import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.81-class-command-center";

export function requirePlatformAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_PLATFORM_ADMIN");
}
