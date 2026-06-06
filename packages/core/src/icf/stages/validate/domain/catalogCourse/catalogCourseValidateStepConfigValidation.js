import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireEnumValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireUUIDValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

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
