import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireEnumValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";
import { requireUUIDValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
