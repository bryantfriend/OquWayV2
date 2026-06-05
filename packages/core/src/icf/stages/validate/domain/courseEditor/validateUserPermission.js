import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
