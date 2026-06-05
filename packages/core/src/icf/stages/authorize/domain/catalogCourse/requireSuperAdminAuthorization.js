import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.63-external-task-student-feedback";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
