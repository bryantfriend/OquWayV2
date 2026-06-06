import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireNonEmptyArrayValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireEnumValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";
import { requireUUIDValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function catalogCourseRequireStepIdValidation(executionState) {
    const { payload } = executionState;
    return requireUUIDValidation(payload.stepId, "stepId");
}
