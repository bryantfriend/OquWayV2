import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
