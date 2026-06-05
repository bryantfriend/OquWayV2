import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
