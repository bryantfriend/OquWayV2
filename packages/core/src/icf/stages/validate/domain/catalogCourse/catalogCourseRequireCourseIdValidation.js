import { requireUUIDValidation } from "../../validators.js?v=1.1.119-student-dashboard-debug-safe";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
