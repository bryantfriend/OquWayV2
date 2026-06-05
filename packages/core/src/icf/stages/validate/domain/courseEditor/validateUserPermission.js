import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
