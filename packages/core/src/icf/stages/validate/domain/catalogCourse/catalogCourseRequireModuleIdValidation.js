import { requireStringValidation } from "../../validators.js?v=1.1.114-student-profile-rules";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.114-student-profile-rules";
import { requireEnumValidation } from "../../validators.js?v=1.1.114-student-profile-rules";
import { requireUUIDValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
