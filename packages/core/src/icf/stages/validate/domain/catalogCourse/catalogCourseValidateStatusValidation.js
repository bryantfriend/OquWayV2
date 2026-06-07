import { requireStringValidation } from "../../validators.js?v=1.1.124-location-icon-upload";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.124-location-icon-upload";
import { requireEnumValidation } from "../../validators.js?v=1.1.124-location-icon-upload";
import { requireUUIDValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
