import { requireUUIDValidation } from "../../validators.js?v=1.1.112-student-assignment-error-debug";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
