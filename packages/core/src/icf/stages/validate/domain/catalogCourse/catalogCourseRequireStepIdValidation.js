import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireEnumValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";
import { requireUUIDValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
