import { requireUUIDValidation } from "../../validators.js?v=1.1.62-external-task-review-loop";

export function catalogCourseRequireCourseIdValidation(executionState) {
    return requireUUIDValidation(executionState.payload.courseId, "courseId");
}
