import { requireUUIDValidation } from "../../validators.js?v=1.1.121-student-dashboard-open-clean";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
