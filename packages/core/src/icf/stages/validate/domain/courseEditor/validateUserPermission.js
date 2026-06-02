import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
