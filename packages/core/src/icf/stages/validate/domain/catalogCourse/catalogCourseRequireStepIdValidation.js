import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireEnumValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";
import { requireUUIDValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
