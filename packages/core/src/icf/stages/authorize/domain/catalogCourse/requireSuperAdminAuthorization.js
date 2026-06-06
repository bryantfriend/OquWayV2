import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.82-shared-command-center-shell";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
