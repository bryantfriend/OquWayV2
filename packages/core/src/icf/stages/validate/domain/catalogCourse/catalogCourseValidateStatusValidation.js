import { requireStringValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";
import { requireEnumValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";
import { requireUUIDValidation } from "../../validators.js?v=1.1.63-external-task-student-feedback";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
