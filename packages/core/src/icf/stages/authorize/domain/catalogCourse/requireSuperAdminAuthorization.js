import { requireRoleValidation } from "../../../validate/validators.js?v=1.1.124-location-icon-upload";

export function requireSuperAdminAuthorization(executionState) {
    return requireRoleValidation(executionState.actor, "ROLE_SUPER_ADMIN");
}
