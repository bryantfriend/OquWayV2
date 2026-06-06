import { requireStringValidation } from "../../validators.js?v=1.1.80-course-module-command-center";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.80-course-module-command-center";
import { requireEnumValidation } from "../../validators.js?v=1.1.80-course-module-command-center";
import { requireUUIDValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
