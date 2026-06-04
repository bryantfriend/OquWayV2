import { requireStringValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireEnumValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";
import { requireUUIDValidation } from "../../validators.js?v=1.1.54-multi-role-assistant";

export function catalogCourseValidateStepConfigValidation(executionState) {
    const { payload } = executionState;

    if (!payload.config || typeof payload.config !== "object") {
        return {
            valid: false,
            errors: [{ field: "config", message: "Step config must be a valid object" }]
        };
    }

    const typeResult = requireStringValidation(payload.config.type, "config.type");
    if (!typeResult.valid) {
        return typeResult;
    }

    return { valid: true };
}
