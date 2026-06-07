import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.111-student-assignment-debug-panel";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
