import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.107-student-firebase-auth-chain";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
