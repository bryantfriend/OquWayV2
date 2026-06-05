import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireEnumValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireUUIDValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function catalogCourseValidateStatusValidation(executionState) {
    const { payload } = executionState;

    if (payload.status) {
        return requireEnumValidation(payload.status, ["DRAFT", "PUBLISHED", "ARCHIVED"], "status");
    }

    return { valid: true };
}
