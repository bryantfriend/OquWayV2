import { requireStringValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
