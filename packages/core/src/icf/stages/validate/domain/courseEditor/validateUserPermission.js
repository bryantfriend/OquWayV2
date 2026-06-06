import { requireStringValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
