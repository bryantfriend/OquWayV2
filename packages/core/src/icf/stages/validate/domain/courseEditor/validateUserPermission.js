import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
