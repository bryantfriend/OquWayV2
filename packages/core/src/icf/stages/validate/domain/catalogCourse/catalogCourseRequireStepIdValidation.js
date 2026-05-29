import { requireStringValidation } from "../../validators.js";
import { requireNonEmptyArrayValidation } from "../../validators.js";
import { requireEnumValidation } from "../../validators.js";
import { requireUUIDValidation } from "../../validators.js";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
