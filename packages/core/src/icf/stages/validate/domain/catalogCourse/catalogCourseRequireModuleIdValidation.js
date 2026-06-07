import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";
import { requireEnumValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";
import { requireUUIDValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function catalogCourseRequireModuleIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.moduleId, "moduleId");
}
