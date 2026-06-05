import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.62-external-task-review-loop";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
