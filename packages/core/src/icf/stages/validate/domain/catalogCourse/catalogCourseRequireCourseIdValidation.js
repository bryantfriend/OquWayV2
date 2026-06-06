import { requireUUIDValidation } from "../../validators.js?v=1.1.80-course-module-command-center";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
