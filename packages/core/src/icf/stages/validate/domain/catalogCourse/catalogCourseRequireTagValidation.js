import { requireStringValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
