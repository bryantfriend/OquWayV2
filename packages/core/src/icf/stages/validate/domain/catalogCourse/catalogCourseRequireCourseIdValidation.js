import { requireUUIDValidation } from "../../validators.js?v=1.1.78-location-command-center";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
