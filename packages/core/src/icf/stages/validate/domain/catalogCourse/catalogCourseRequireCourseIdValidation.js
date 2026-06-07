import { requireUUIDValidation } from "../../validators.js?v=1.1.110-student-class-alias-query";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
