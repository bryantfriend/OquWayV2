import { requireStringValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
