import { requireUUIDValidation } from "../../validators.js?v=1.1.109-student-assignment-status-fallback";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
