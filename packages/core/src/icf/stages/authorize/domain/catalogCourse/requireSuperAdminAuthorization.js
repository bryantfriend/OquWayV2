import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.109-student-assignment-status-fallback";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
