import { requireUUIDValidation } from "../../validators.js?v=1.1.124-location-icon-upload";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
