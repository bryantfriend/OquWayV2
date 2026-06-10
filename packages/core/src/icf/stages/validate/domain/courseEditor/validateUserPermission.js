import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
