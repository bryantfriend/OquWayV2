import { requireUUIDValidation } from "../../validators.js?v=1.1.116-student-token-ready";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
