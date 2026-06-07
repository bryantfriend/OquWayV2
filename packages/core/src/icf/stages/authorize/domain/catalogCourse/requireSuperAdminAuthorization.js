import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.117-student-identity-binding";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
