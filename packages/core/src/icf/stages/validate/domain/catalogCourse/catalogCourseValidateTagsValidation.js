import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireEnumValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireUUIDValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

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
