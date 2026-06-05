import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireEnumValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireUUIDValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function catalogCourseRequireVersionValidation(executionState) {
    const { payload } = executionState;

    if (payload.version === undefined || payload.version === null) {
        return {
            valid: false,
            errors: [{ field: "version", message: "Version is required" }]
        };
    }

    if (typeof payload.version !== "number" || payload.version < 1) {
        return {
            valid: false,
            errors: [{ field: "version", message: "Version must be a positive integer" }]
        };
    }

    return { valid: true };
}
