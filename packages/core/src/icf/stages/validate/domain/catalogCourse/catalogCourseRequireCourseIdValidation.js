import { requireUUIDValidation } from "../../validators.js?v=1.1.117-student-identity-binding";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
