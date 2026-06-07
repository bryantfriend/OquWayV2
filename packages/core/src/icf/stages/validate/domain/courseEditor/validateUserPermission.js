import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
