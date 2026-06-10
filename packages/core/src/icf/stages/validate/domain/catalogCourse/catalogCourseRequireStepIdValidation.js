import { requireStringValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireEnumValidation } from "../../validators.js?v=1.1.162-modal-stack";
import { requireUUIDValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
