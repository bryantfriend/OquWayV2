import { requireStringValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
