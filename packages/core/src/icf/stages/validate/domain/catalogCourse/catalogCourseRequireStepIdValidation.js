import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireEnumValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";
import { requireUUIDValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
