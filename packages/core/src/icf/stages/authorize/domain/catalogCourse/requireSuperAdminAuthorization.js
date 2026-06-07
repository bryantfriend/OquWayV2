import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.118-fruit-login-student-identity";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
