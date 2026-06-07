import { requireStringValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireEnumValidation } from "../../validators.js?v=1.1.117-student-identity-binding";
import { requireUUIDValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
