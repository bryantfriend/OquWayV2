import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateAuthenticated(executionState) {
    if (!executionState.actor || !executionState.actor.id) {
        return {
            valid: false,
            errors: [{ field: "actor", message: "User must be authenticated" }]
        };
    }
    return { valid: true };
}
