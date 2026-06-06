import { requireUUIDValidation } from "../../validators.js?v=1.1.108-student-class-alias-merge";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
