import { requireStringValidation } from "../../validators.js?v=1.1.120-student-course-debug-summary";

export function catalogCourseRequireTagValidation(executionState) {
    return requireStringValidation(executionState.payload.tag, "tag");
}
