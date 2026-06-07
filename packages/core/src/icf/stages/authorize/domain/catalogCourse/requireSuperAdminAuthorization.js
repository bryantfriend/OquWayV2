import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.113-student-rules-read";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
