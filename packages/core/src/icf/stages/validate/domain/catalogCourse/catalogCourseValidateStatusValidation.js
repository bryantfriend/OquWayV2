import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireEnumValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireUUIDValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
