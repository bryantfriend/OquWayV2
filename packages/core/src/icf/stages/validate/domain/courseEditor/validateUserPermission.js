import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
