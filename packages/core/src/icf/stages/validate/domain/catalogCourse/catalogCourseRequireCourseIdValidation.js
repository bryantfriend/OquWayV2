import { requireUUIDValidation } from "../../validators.js?v=1.1.107-student-firebase-auth-chain";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
