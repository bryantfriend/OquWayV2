import { requireStringValidation } from "../../validators.js?v=1.1.226-learning-activity-files";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.226-learning-activity-files";
import { requireEnumValidation } from "../../validators.js?v=1.1.226-learning-activity-files";
import { requireUUIDValidation } from "../../validators.js?v=1.1.226-learning-activity-files";
import { isSupportedStepType, normalizeStepType } from "../../../../../shared/stepTypes/stepTypeRegistry.js?v=1.1.226-learning-activity-files";

export function catalogCourseValidateStepConfigValidation(executionState) {
    const { payload } = executionState;

    if (!payload.config || typeof payload.config !== "object") {
        return {
            valid: false,
            errors: [{ field: "config", message: "Step config must be a valid object" }]
        };
    }

    const stepType = readStepType(payload);
    const typeResult = requireStringValidation(stepType, "stepType");
    if (!typeResult.valid) {
        return typeResult;
    }

    if (!isSupportedStepType(stepType)) {
        return {
            valid: false,
            errors: [{ field: "stepType", message: "Unsupported step type: " + stepType }]
        };
    }

    return { valid: true };
}
function readStepType(payload) {
    const source = payload || {};
    const config = source.config && typeof source.config === "object" && !Array.isArray(source.config) ? source.config : {};
    const stepType = source.stepType || source.stepTypeId || source.type || source.activityType || config.type || config.stepType || config.activityType || "";

    return normalizeStepType(stepType || "");
}
