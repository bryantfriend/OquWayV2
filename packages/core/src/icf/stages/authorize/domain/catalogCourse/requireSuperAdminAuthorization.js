import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.116-student-token-ready";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
