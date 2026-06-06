import { requireStringValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
