import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
