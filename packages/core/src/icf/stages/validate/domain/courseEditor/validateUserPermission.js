import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function validateUserPermission(executionState) {
    // Advanced role checking is deferred to Authorization stages
    return { valid: true };
}
