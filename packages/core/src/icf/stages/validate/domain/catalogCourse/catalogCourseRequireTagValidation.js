import { requireStringValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
