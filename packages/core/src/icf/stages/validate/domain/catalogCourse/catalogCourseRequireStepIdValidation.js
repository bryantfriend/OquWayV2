import { requireStringValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireEnumValidation } from "../../validators.js?v=1.1.29-module-render-fix";
import { requireUUIDValidation } from "../../validators.js?v=1.1.29-module-render-fix";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
