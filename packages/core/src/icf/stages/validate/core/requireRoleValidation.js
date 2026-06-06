import { hasAnyRole } from "../../authorize/core/roleAuthorization.js?v=1.1.80-course-module-command-center";

export function requireRoleValidation(actor, requiredRole) {
    if (!actor) {
        return {
            valid: false,
            errors: [{ field: "actor", message: "Actor is required" }]
        };
    }

    if (!hasAnyRole(actor, [requiredRole])) {
        return {
            valid: false,
            errors: [{ field: "actor.role", message: "Actor must have role: " + requiredRole }]
        };
    }

    return { valid: true };
}
