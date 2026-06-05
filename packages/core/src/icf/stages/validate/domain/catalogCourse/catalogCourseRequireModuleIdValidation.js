import { requireStringValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireEnumValidation } from "../../validators.js?v=1.1.78-location-command-center";
import { requireUUIDValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
