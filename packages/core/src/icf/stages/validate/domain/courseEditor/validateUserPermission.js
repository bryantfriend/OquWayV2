import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
