import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireEnumValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";
import { requireUUIDValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
