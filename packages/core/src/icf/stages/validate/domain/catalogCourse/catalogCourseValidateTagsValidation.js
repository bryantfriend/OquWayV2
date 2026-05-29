import { requireStringValidation } from "../../validators.js";
import { requireNonEmptyArrayValidation } from "../../validators.js";
import { requireEnumValidation } from "../../validators.js";
import { requireUUIDValidation } from "../../validators.js";

export function catalogCourseValidateTagsValidation(executionState) {
    const { payload } = executionState;

    if (payload.tags) {
        if (!Array.isArray(payload.tags)) {
            return {
                valid: false,
                errors: [{ field: "tags", message: "Tags must be an array" }]
            };
        }

        if (payload.tags.length > 20) {
            return {
                valid: false,
                errors: [{ field: "tags", message: "Maximum 20 tags allowed" }]
            };
        }

        for (let i = 0; i < payload.tags.length; i++) {
            const tagResult = requireStringValidation(payload.tags[i], "tags[" + i + "]");
            if (!tagResult.valid) {
                return tagResult;
            }
        }
    }

    return { valid: true };
}
