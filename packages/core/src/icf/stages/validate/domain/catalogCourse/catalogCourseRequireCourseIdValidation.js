import { requireUUIDValidation } from "../../validators.js?v=1.1.111-student-assignment-debug-panel";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
