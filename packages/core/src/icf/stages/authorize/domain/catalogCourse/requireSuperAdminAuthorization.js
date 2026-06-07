import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.114-student-profile-rules";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
