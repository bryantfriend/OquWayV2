import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
