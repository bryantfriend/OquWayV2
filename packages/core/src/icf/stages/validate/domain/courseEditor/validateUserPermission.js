import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
