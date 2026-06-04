import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
