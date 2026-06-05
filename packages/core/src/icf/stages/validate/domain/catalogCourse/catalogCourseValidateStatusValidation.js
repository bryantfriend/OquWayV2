import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireEnumValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireUUIDValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
