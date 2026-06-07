import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
