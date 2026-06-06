import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireEnumValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";
import { requireUUIDValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
