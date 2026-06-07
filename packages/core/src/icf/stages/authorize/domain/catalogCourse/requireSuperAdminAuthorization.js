import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.112-student-assignment-error-debug";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
