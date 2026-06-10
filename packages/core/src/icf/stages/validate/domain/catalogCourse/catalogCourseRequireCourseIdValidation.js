import { requireUUIDValidation } from "../../validators.js?v=1.1.162-modal-stack";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
