import { requireUUIDValidation } from "../../validators.js?v=1.1.113-student-rules-read";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
