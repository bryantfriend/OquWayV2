import { requireUUIDValidation } from "../../validators.js?v=1.1.79-user-command-center";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
