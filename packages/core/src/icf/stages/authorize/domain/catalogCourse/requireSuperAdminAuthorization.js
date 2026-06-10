import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.162-modal-stack";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
