import { requireStringValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
