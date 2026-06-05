import { requireStringValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireEnumValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";
import { requireUUIDValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
