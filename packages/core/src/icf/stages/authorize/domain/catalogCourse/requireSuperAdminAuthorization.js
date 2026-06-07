import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.110-student-class-alias-query";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
