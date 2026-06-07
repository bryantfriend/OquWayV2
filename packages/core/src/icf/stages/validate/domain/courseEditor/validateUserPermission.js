import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
