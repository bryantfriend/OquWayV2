import { requireStringValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
