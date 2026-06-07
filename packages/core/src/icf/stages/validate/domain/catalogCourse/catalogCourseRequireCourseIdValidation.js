import { requireUUIDValidation } from "../../validators.js?v=1.1.118-fruit-login-student-identity";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
