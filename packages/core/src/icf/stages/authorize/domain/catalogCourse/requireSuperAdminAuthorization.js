import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.54-multi-role-assistant";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
