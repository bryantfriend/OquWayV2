import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.80-course-module-command-center";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
