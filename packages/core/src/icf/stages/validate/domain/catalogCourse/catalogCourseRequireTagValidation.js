import { requireStringValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
