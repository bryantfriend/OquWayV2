import { requireStringValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
