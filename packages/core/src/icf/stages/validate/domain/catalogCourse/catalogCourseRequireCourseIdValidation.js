import { requireUUIDValidation } from "../../validators.js?v=1.1.82-shared-command-center-shell";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
