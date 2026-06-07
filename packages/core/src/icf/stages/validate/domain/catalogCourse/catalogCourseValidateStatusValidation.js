import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireEnumValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireUUIDValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
