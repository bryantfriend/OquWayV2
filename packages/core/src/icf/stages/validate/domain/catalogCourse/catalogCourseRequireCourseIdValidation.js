import { requireUUIDValidation } from "../../validators.js?v=1.1.114-student-profile-rules";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
