import { requireStringValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
