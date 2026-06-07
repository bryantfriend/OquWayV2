import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function validateAuthenticated(executionState) {
    if (!executionState.actor || !executionState.actor.id) {
        return {
            valid: false,
            errors: [{ field: "actor", message: "User must be authenticated" }]
        };
    }
    return { valid: true };
}
